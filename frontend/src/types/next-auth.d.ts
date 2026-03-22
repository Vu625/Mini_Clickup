import { JWT } from "next-auth/jwt"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    // Tách riêng accessToken và user ra nhé
    accessToken?: string; 
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}