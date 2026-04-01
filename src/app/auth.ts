import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/zodSchemas";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/User.model";
import { rateLimit } from "@/app/api/_utils/rateLimit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Rate limit check (by IP)
        const ip = req?.headers?.["x-forwarded-for"] as string || "unknown";

        const { success } = await rateLimit(ip);
        if (!success) throw new Error("Too many requests. Try again later.");

        // Zod validation
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) throw new Error("Invalid input");

        const { email, password } = parsed.data;

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Invalid credentials");

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export async function auth() {
  return await getServerSession(authOptions);
}

export { handler as GET, handler as POST };
