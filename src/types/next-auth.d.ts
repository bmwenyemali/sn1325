import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
      role: string;
      privileges: string[];
      province?: string;
      image?: string;
      fonction?: string;
      organisation?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    province?: string;
    image?: string;
    fonction?: string;
    organisation?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nom: string;
    prenom: string;
    role: string;
    province?: string;
    fonction?: string;
    organisation?: string;
  }
}
