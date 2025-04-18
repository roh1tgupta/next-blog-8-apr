'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  slug: string;
  isAdmin: boolean;
}

export default function DeleteButton({ slug, isAdmin }: DeleteButtonProps) {
  
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/blogs/api/posts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        // Redirect to homepage after deletion
        router.push('/');
        router.refresh(); // Refresh the page to update the post list
      } else {
        console.error('Failed to delete post:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return isAdmin && (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:underline text-sm disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}