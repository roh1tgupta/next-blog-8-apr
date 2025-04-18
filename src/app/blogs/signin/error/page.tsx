'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold text-primary mb-6">Authentication Error</h1>
      <p className="text-red-500 mb-4">Error: {error || 'Unknown error'}</p>
      <a href="/blogs/signin" className="text-accent hover:underline">
        Try Again
      </a>
    </div>
  );
}