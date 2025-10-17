import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./src/lib/db";
import { User } from "./src/models/User";

type AuthUser = {
  id?: string;
  _id?: { toString?: () => string } | string;
  role?: string | { toString?: () => string };
  name?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const email = String(credentials.email).toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          String(credentials.password),
          String(user.password)
        );

        if (!isPasswordValid) {
          return null;
        }

        const u = user as AuthUser;
        return {
          id: user._id.toString(),
          email: String(user.email),
          name: u.name || `${user.nom || ""} ${user.prenom || ""}`.trim(),
          nom: String(user.nom || ""),
          prenom: String(user.prenom || ""),
          role: user.role ? user.role.toString() : "",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u2 = user as AuthUser;
        let rawId = "";
        if (u2.id) rawId = String(u2.id);
        else if (u2._id) {
          if (typeof u2._id === "string") rawId = u2._id;
          else if (typeof u2._id === "object" && u2._id !== null) {
            const maybeToString = (u2._id as { toString?: () => string })
              .toString;
            if (typeof maybeToString === "function")
              rawId = maybeToString.call(u2._id) as string;
          }
        }
        token.id = String(rawId ?? "");
        token.role = String(u2.role ?? "");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userExt = session.user as unknown as {
          id?: string;
          role?: string;
        };
        userExt.id = String((token as unknown as { id?: unknown }).id ?? "");
        userExt.role = String(
          (token as unknown as { role?: unknown }).role ?? ""
        );
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
