import Link from 'next/link';
import SignOutButton from './SignOutButton';

export default function Navbar({isAdmin}: {isAdmin: boolean}) {

  return (
    <nav className="bg-primary text-white p-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link
          href="/blogs"
          className="text-3xl font-bold tracking-tight hover:text-accent transition-colors duration-300"
        >
          My Blog
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-8">
          <Link
            href="/blogs"
            className="text-lg font-medium hover:text-accent transition-colors duration-300 hover:border-b-2 hover:border-accent pb-1"
          >
            Home
          </Link>
          {isAdmin && <Link href="/blogs/create" className="text-lg font-medium hover:text-accent transition-colors duration-300 hover:border-b-2 hover:border-accent pb-1">
            Create
          </Link>}
          <Link
            href="/about-the-author"
            className="text-lg font-medium hover:text-accent transition-colors duration-300 hover:border-b-2 hover:border-accent pb-1"
          >
            About the Author
          </Link>
          {isAdmin && <SignOutButton />}
        </div>
      </div>
    </nav>
  );
}