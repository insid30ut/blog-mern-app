import CategoryForm from '@/components/admin/faq/CategoryForm';
import { IFAQCategory } from '@/models/FAQCategory';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { notFound } from 'next/navigation'; // For handling not found categories
import { headers } from 'next/headers'; // Import headers

interface EditFAQCategoryPageProps {
  params: {
    id: string;
  };
}

// Function to fetch a single category by ID
// This would typically be an API call.
async function getCategory(id: string): Promise<IFAQCategory | null> {
  const cookie = headers().get('cookie');
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/faq-categories/${id}`, {
    cache: 'no-store',
    headers: {
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null; // Category not found
    }
    console.error(`Failed to fetch category ${id}:`, await res.text());
    // throw new Error(`Failed to fetch category ${id}`);
    return null; // Or handle error more gracefully
  }
  try {
    return await res.json();
  } catch (e) {
    console.error(`Failed to parse category JSON for ${id}:`, e);
    return null;
  }
}

export default async function EditFAQCategoryPage({ params }: EditFAQCategoryPageProps) {
  const { id } = params;
  const category = await getCategory(id);

  if (!category) {
    notFound(); // Triggers the not-found.js file or default Next.js 404 page
  }

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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit FAQ Category</h1>
      <div className="max-w-xl">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}