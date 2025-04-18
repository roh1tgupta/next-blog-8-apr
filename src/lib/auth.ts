import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      
      async authorize(credentials) {
        const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_USER_NAME;
        const ADMIN_PASSWORD = process.env.ADMIN_CRED;
        if (
          credentials?.email === ADMIN_EMAIL &&
          credentials?.password === ADMIN_PASSWORD
        ) {
          return { id: '1', name: 'Admin', email: ADMIN_EMAIL };
        }
        return null; // Unauthorized
      },
    }),
  ],
  pages: {
    signIn: '/blogs/signin',
    error: '/blogs/signin/error',
  },
  // secret: process.env.NEXTAUTH_SECRET,
};