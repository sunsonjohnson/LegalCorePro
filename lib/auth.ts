import { NextAuthOptions } from 'next-auth'
import { User } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // Note: In production, you'd have a password field and hash comparison
        // For demo purposes, we'll accept any password
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          lawFirmId: user.lawFirmId,
          image: user.image || null
        } as User
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.lawFirmId = user.lawFirmId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.lawFirmId = token.lawFirmId as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}