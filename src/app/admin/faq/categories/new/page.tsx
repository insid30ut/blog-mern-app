import CategoryForm from '@/components/admin/faq/CategoryForm';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function NewFAQCategoryPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Link
          href="/admin/faq/categories"
          className="inline-flex items-center gap-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back to Categories
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New FAQ Category</h1>
      <div className="max-w-xl">
        <CategoryForm />
      </div>
    </div>
  );
}