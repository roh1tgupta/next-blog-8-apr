'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Prevent automatic redirect
    window.location.href = '/'; // Manually redirect to landing page
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-accent hover:underline text-sm"
    >
      Sign Out
    </button>
  );
}