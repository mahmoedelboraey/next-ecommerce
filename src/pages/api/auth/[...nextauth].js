import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbconnected from "@/pages/lib/mongodb";
import UserAuth from "@/pages/models/UserAuth";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        await dbconnected();

        const user = await UserAuth.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) throw new Error("Invalid password");

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    GithubProvider({
      clientId:     process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    GoogleProvider({
      clientId:     process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "github" || account.provider === "google") {
        await dbconnected();
        const existing = await UserAuth.findOne({ email: user.email });
        if (!existing) {
          await UserAuth.create({
            name:  user.name,
            email: user.email,
            image: user.image,
          });
        }
      }
      return true;
    },

    async session({ session }) {
      await dbconnected();
      const dbUser = await UserAuth.findOne({ email: session.user.email });
      if (dbUser) session.user.id = dbUser._id.toString();
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

export default NextAuth(authOptions);