import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { IBlogPost } from '@/models/BlogPost';
import { IUser } from '@/models/User'; // For populated author type
import { headers } from 'next/headers'; // Import headers

interface PopulatedBlogPost extends Omit<IBlogPost, 'author' | '_id' | 'createdAt' | 'updatedAt'> {
  _id: string;
  author: Pick<IUser, '_id' | 'name' | 'email'> & { _id: string };
  createdAt: Date; // Keep as Date
  updatedAt: Date; // Keep as Date
}

async function getBlogPosts(): Promise<PopulatedBlogPost[]> {
  const cookie = headers().get('cookie');
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/blog/posts`, {
    cache: 'no-store',
    headers: {
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    console.error('Failed to fetch blog posts for admin:', await res.text());
    return [];
  }
  try {
    const posts = await res.json();
    return posts.map((post: any) => ({
      ...post,
      _id: post._id?.toString(),
      author: {
        ...post.author,
        _id: post.author?._id?.toString(),
      },
      // Keep as Date objects
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    })) as PopulatedBlogPost[];
  } catch (e) {
    console.error('Failed to parse blog posts JSON for admin:', e);
    return [];
  }
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
        <Link
          href="/admin/blog/posts/new" // Corrected link to new post page
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          New Blog Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No blog posts found. Create one to get started!</p>
      ) : (
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Author
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Slug
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Published
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created At
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 max-w-sm truncate">
                        {post.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {post.author?.name || post.author?.email || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{post.slug}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {post.isPublished ? 'Yes' : 'No'}
                      </td>
                       <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {post.createdAt.toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link href={`/admin/blog/posts/edit/${post._id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {post.title}</span>
                        </Link>
                        {/* Delete button/modal would go here */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}