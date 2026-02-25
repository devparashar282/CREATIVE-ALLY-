import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

function getNoDbAdminUser(email: string, password: string) {
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
  if (!adminEmail || !adminPassword) return null;
  if (email.toLowerCase() !== adminEmail) return null;
  if (password !== adminPassword) return null;

  return {
    id: "local-admin",
    name: "Creative Ally Admin",
    email: adminEmail,
    role: "admin",
    phone: "",
    countryCode: "+91",
    image: ""
  } as any;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        if (!process.env.MONGODB_URI?.trim()) {
          return getNoDbAdminUser(credentials.email, credentials.password);
        }

        try {
          await connectDb();
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          if (!user) return null;
          const ok = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!ok) return null;
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            countryCode: user.countryCode,
            image: user.imageUrl || ""
          } as any;
        } catch (error) {
          console.error("Auth authorize failed", error);
          return getNoDbAdminUser(credentials.email, credentials.password);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.phone = (user as any).phone;
        token.countryCode = (user as any).countryCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
        (session.user as any).countryCode = token.countryCode;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export function auth() {
  return getServerSession(authOptions);
}
