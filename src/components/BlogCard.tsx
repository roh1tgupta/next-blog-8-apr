import Link from 'next/link';

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
}

export default function BlogCard({ title, excerpt, slug }: BlogCardProps) {
  // Truncate excerpt to 150 characters with ellipsis
  const truncatedExcerpt = excerpt.length > 150 ? `${excerpt.slice(0, 150)}...` : excerpt;

  return (
    <div
      className="rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 focus:scale-105 focus:outline-none"
      tabIndex={0} // Make the card focusable
    >
      <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
      <p className="text-secondary mb-4">{truncatedExcerpt}</p>
      <Link href={`/blogs/posts/${slug}`} className="text-accent hover:underline">
        Read More
      </Link>
    </div>
  );
}