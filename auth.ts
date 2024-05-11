// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import type {NextAuthConfig} from 'next-auth'

// const prisma = new PrismaClient();

export const config = {
  theme: {
    logo: 'https://imgur.lzmun.com/picgo/logo/tripper2colorfull.png_avatar'
  },
  // adapter: PrismaAdapter(prisma),
  providers: [GitHub({clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET})],
  basePath: '/auth',
  callbacks: {
    authorized({request, auth}) {
      const {pathname} = request.nextUrl
      if (pathname.startsWith('/dashboard')) return !!auth
      return true
    },
    jwt({token, trigger, session}) {
      if (trigger === 'update') token.name = session.user.name
      return token
    }
  }
} satisfies NextAuthConfig

export const {handlers, auth, signIn, signOut} = NextAuth(config)
