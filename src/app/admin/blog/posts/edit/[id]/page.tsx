import PostForm from '@/components/admin/blog/PostForm';
import { IBlogPost } from '@/models/BlogPost';
import { IUser } from '@/models/User';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'; // Import headers

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

// Define a more specific type for the fetched post data for the form
interface FormInitialData extends Omit<IBlogPost, '_id' | 'author' | 'createdAt' | 'updatedAt'> {
  _id: string;
  author: { _id: string; name?: string | null }; // Only need author's ID and name for the form context
  createdAt: string; // Or Date, if PostForm expects Date
  updatedAt: string; // Or Date
}


async function getPost(id: string): Promise<FormInitialData | null> {
  const cookie = headers().get('cookie');
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/blog/posts/${id}`, {
    cache: 'no-store',
    headers: {
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    console.error(`Failed to fetch blog post ${id}:`, await res.text());
    return null;
  }
  try {
    const post = await res.json();
    // Ensure _id fields are strings and dates are handled as needed by PostForm
    return {
      ...post,
      _id: post._id.toString(),
      author: {
        _id: post.author._id.toString(),
        name: post.author.name,
      },
      createdAt: post.createdAt, // Keep as string from API or convert to Date if form needs
      updatedAt: post.updatedAt,
    };
  } catch (e) {
    console.error(`Failed to parse blog post JSON for ${id}:`, e);
    return null;
  }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back to Blog Posts
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Blog Post</h1>
      <div className="max-w-3xl">
        {/* Type assertion needed if PostForm expects a more specific initialData type */}
        <PostForm initialData={post as any} /> 
      </div>
    </div>
  );
}