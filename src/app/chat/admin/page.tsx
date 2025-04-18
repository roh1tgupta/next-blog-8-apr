import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminChatClient from './AdminChatClient';

export default async function AdminChatPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_USER_NAME) {
    redirect('/blogs/signin');
  }

  return <AdminChatClient />;
}