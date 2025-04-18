// Client component for session checks
'use client';
import DeleteButton from '@/components/DeleteButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

export function AdminControls1({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  
  useEffect(() => {
    setIsAdmin(session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_NAME);
  }, [session]);

  if (!isAdmin) return null;

  return (
    <div className="mt-6 flex space-x-4">
      <Link href={`/blogs/edit/${slug}`} className="text-accent hover:underline">
        Edit Post
      </Link>
      <DeleteButton slug={slug} isAdmin={isAdmin} />
    </div>
  );
}

export default function AdminControls({ slug }: { slug: string }) {
  return (
    <SessionProvider>
      <AdminControls1 slug={slug}/>
    </SessionProvider>
  );
}