
// src/app/blogs/posts/[slug]/page.tsx
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Post, { PostType } from '@/models/Post';
// import DeleteButton from '@/components/DeleteButton';
import AdminControls from './AdminControls';

type PostLean = Omit<PostType, keyof Document> & { _id: string; title: string };

// Helper function for async data fetching
async function getPostData(slug: string): Promise<{ post: PostLean | null }> {
  try {
    await dbConnect();
    const post: PostLean | null = await Post.findOne({ slug }).lean<PostLean>();
    return { post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { post: null };
  }
}

export async function generateStaticParams() {
  try {
    await dbConnect();
    const posts = await Post.find().select('slug').lean();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}



// Async wrapper
export default async function BlogPostWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post } = await getPostData(slug);

  // Synchronous Page component
  function BlogPost({ post }: { post: PostLean | null }) {
    if (!post) {
      return (
        <article className="prose max-w-none">
          <div>Post not found</div>
          <Link href="/blogs" className="text-accent hover:underline">
            Back to Home
          </Link>
        </article>
      );
    }

    return (
      <article className="prose max-w-none">
        <h1 className="text-3xl font-bold text-primary mb-4">{post.title}</h1>
        <div className="inline-flex gap-4">
          <p className="text-sm text-secondary mb-6">
            Posted on {new Date(post.createdAt).toLocaleDateString()}
          </p>
          {post.updatedAt && (
            <p className="text-sm text-secondary mb-6">
              Updated on {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="text-secondary" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-6 flex space-x-4">
          <Link href="/blogs" className="text-accent hover:underline">
            Back to Home
          </Link>
        </div>
        <AdminControls slug={post.slug} />
      </article>
    );
  }

  return <BlogPost post={post} />;
}

