import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string; // ✅ Extend session to include id
    };
  }

  interface User extends DefaultUser {
    id: string; // ✅ Extend user to include id
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // ✅ Extend JWT to include id
  }
}
