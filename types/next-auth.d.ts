import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "admin";
      phone?: string;
      countryCode?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
