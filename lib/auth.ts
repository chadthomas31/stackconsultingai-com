import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email)
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) {
          console.log("Missing email or password")
          return null
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) {
            console.log("User not found:", email)
            return null
          }

          const isValid = await compare(password, user.passwordHash)
          if (!isValid) {
            console.log("Invalid password for:", email)
            return null
          }

          console.log("Authorize success for:", email)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
