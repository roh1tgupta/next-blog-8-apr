import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import BlogCard from '@/components/BlogCard';

export default async function Home() {
  await dbConnect();
  const posts = await Post.find().lean();

  const postData = posts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt || post.content.slice(0, 100) + '...',
    slug: post.slug,
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {postData.map((post) => (
          <div key={post.slug} className="relative group">
            <BlogCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}