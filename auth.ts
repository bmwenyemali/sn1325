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
        // Role is a simple string: "ADMIN" or "VISITOR"
        const roleCode = String(user.role || "VISITOR");

        return {
          id: user._id.toString(),
          email: String(user.email),
          name: u.name || `${user.nom || ""} ${user.prenom || ""}`.trim(),
          nom: String(user.nom || ""),
          prenom: String(user.prenom || ""),
          role: roleCode,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userExt = session.user as any;
        userExt.id = String(token.id ?? "");
        userExt.role = String(token.role ?? "");
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
