import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]/route';

// async function checkAuth(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   const ADMIN_EMAIL = process.env.ADMIN_USER_NAME; // Match with authOptions
//   if (!session || session.user?.email !== ADMIN_EMAIL) {
//     return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
//   }
//   return null;
// }

export async function POST(req: NextRequest) {
  // const unauthorized = await checkAuth(req);
  // if (unauthorized) return unauthorized;


  await dbConnect();
  try {
    const { title, slug, content, excerpt } = await req.json();
    const post = new Post({ title, slug, content, excerpt });
    await post.save();
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  // const unauthorized = await checkAuth(req);
  // if (unauthorized) return unauthorized;

  await dbConnect();
  try {
    const { title, slug, excerpt, content, originalSlug, updatedAt } = await req.json();

    console.log(updatedAt, ".....updatedAt")
    const updatedPost = await Post.findOneAndUpdate(
      { slug: originalSlug }, // Find by original slug
      { title, slug, excerpt, content, updatedAt: updatedAt ? new Date(updatedAt) : undefined }, // Update fields
      { new: true, runValidators: true } // Return updated doc, validate schema
    );
    if (!updatedPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    console.log('Updated post:', updatedPost.toObject());
    return NextResponse.json({ success: true, data: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop();
    const post = await Post.findOne({ slug }).lean();
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  // const unauthorized = await checkAuth(req);
  // if (unauthorized) return unauthorized;

  await dbConnect();
  try {
    const { slug } = await req.json();
    console.log('Delete request for slug:', slug);

    const deletedPost = await Post.findOneAndDelete({ slug });

    if (!deletedPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    console.log('Deleted post:', deletedPost.toObject());
    return NextResponse.json({ success: true, message: 'Post deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}