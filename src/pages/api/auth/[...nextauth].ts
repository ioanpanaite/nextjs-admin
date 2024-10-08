import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from 'next-auth'
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { compareSync } from "bcrypt-ts";
import { UserDataType } from "src/context/types";

interface Credentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const { email, password, rememberMe } = credentials as Credentials

          await connectDB()
          const user = await UserModel.findOne({ email: email })

          // const user = userData.length > 0 ? userData[0] : null

          if (!user) {
            throw new Error('User account is not available!');
          }

          const comparePassword = user.password as string || ''
          const isValid = compareSync(password, comparePassword)
          if (!isValid) {
            throw new Error('Could not log you in!');
          }

          // Set rememberMe option
          await UserModel.updateOne({ _id: user._id }, { rememberMe: rememberMe })

          return {
            id: user._id.toString(),
            role: user.role,
            fullName: user.fullName,
            username: user.username,
            email: email,
            currentPlan: user.currentPlan,
            status: user.status
          };

        } catch (error) {
          console.log(error);

          return null;
        }
      },
    })
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 Day
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.user = user
      }

      return token
    },
    async signIn({ account, profile }) {
      return true;
    },
    async session({ session, token, user }) {
      session.user = token.user as UserDataType

      return session
    },
  }
}

export default NextAuth(authOptions)

