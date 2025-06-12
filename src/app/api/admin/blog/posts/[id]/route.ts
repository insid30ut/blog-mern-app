import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

interface Params {
  id: string;
}

// GET a single Blog Post (for admin)
export async function GET(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid post ID format' }, { status: 400 });
  }

  try {
    const post = await BlogPost.findById(id).populate('author', 'name email _id');
    if (!post) {
      return NextResponse.json({ message: 'Blog Post not found' }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching blog post by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// PUT (update) a Blog Post
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid post ID format' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { title, content, isPublished, slug } = body;

    const postToUpdate = await BlogPost.findById(id);
    if (!postToUpdate) {
      return NextResponse.json({ message: 'Blog Post not found' }, { status: 404 });
    }

    // Ensure only the author or an admin can update (though this route is admin-only already)
    // For added safety, if you had different roles:
    // if (postToUpdate.author.toString() !== session.user.id && session.user.role !== 'admin') {
    //   return NextResponse.json({ message: 'Forbidden: You can only edit your own posts.' }, { status: 403 });
    // }

    if (title) postToUpdate.title = title;
    if (content) postToUpdate.content = content;
    if (isPublished !== undefined) postToUpdate.isPublished = isPublished;
    if (slug) postToUpdate.slug = slug;
    // Pre-save hook handles slug generation if title changes and slug isn't explicitly set

    const updatedPost = await postToUpdate.save();
    return NextResponse.json(updatedPost, { status: 200 });

  } catch (error: any) {
    console.error('Error updating blog post:', error);
    if (error.code === 11000) { // Duplicate key error
      return NextResponse.json({ message: 'A blog post with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// DELETE a Blog Post
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid post ID format' }, { status: 400 });
  }

  try {
    const postToDelete = await BlogPost.findById(id);
    if (!postToDelete) {
      return NextResponse.json({ message: 'Blog Post not found' }, { status: 404 });
    }

    // Similar authorization check as PUT if needed for non-admin roles
    // if (postToDelete.author.toString() !== session.user.id && session.user.role !== 'admin') {
    //   return NextResponse.json({ message: 'Forbidden: You can only delete your own posts.' }, { status: 403 });
    // }

    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Blog Post deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}