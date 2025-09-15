import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: string
      lawFirmId?: string
    }
  }

  interface User {
    role: string
    lawFirmId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    lawFirmId?: string
  }
}