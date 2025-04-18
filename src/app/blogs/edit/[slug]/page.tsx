import dbConnect from '@/lib/mongodb';
import Post, { PostLean } from '@/models/Post';
import EditForm from './EditForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';


// interface PageProps {
//   params: { slug: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  
   
  if (!session || session.user?.email !== process.env.ADMIN_USER_NAME) {
    redirect('/blogs');
  }

  await dbConnect();
  const { slug } = await params;
  const rawPost: PostLean | null = await Post.findOne({ slug }).lean<PostLean>();

  if (!rawPost) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Post not found</h1>
      </div>
    );
  }

  const post: PostLean = {
    ...rawPost,
    _id: rawPost._id.toString(),
    createdAt: rawPost.createdAt,
    updatedAt: rawPost.updatedAt ? rawPost.updatedAt : undefined,
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <EditForm initialPost={post} />
    </div>
  );
}