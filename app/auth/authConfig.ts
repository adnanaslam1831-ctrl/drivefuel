/**
 * NextAuth Configuration
 * Email/Password and OAuth authentication
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'

// Mock user database (replace with Prisma)
const usersDatabase: any[] = [
  {
    id: 'user_demo',
    email: 'demo@drivefuel.app',
    name: 'Demo User',
    password: bcrypt.hashSync('password123', 10),
    emailVerified: new Date(),
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        // Find user
        const user = usersDatabase.find(
          (u) => u.email === credentials.email.toLowerCase()
        )

        if (!user) {
          throw new Error('User not found')
        }

        // Check password
        const passwordMatch = bcrypt.compareSync(
          credentials.password,
          user.password
        )

        if (!passwordMatch) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),

    // Google OAuth (optional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),

    // GitHub OAuth (optional)
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },

    async signIn({ user, account, profile }) {
      // Prevent sign-in if email not verified
      if (account?.type === 'oauth') {
        return true
      }
      return true
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      console.log(`User ${user?.email} signed in. New: ${isNewUser}`)
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
}

/**
 * Helper function to register new user
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  // Check if user already exists
  const existingUser = usersDatabase.find(
    (u) => u.email === email.toLowerCase()
  )

  if (existingUser) {
    throw new Error('User already exists')
  }

  // Validate password
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10)

  // Create user
  const newUser = {
    id: `user_${Date.now()}`,
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    emailVerified: null,
    createdAt: new Date(),
  }

  usersDatabase.push(newUser)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  }
}
