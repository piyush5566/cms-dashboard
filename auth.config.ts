import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return true; // Make all routes accessible without authentication
    },
  },
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;