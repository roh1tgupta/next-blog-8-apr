import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'My Blog',
  description: 'A modern blog built with Next.js',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_NAME; // Match hardcoded email

  
  return (
      <body className="min-h-screen flex flex-col">
        <Navbar isAdmin={isAdmin} />
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
  );
}