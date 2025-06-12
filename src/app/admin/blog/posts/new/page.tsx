import PostForm from '@/components/admin/blog/PostForm';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function NewBlogPostPage() {
  // No initial data or categories needed for a new post form,
  // as author is derived from session server-side.
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Blog Post</h1>
      <div className="max-w-3xl"> {/* Increased max-width for editor */}
        <PostForm />
      </div>
    </div>
  );
}