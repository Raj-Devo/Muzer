import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  
  callbacks: {
    // 🔥 Save user to the database if not existing
    async signIn(params) {
      if (!params.user.email) {
        return false;
      }

      try {
        const existingUser = await prismaClient.user.findUnique({
          where: { email: params.user.email },
        });

        if (!existingUser) {
          await prismaClient.user.create({
            data: {
              email: params.user.email,
              provider: "Google",
            },
          });
        }
      } catch (e) {
        console.error("Error signing in:", e);
        return false;
      }

      return true;
    },

    // ✅ Attach user ID to the token
    async jwt({ token, user }) {
      if (user) {
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email ?? "" },
        });

        if (existingUser) {
          token.id = existingUser.id; // ✅ TypeScript now knows `id` is a string
        }
      }
      return token;
    },

    // ✅ Pass user ID to the session
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id; // ✅ TypeScript now recognizes `id` as a string
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
