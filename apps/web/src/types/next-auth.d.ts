import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
