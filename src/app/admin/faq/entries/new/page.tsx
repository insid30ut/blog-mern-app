import EntryForm from '@/components/admin/faq/EntryForm';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { IFAQCategory } from '@/models/FAQCategory';
import { headers } from 'next/headers'; // Import headers

// Function to fetch categories - this should be an authenticated fetch
async function getCategories(): Promise<(Pick<IFAQCategory, '_id' | 'name'> & { _id: string })[]> {
  const cookie = headers().get('cookie'); // Get cookies from the incoming request to the page

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/faq-categories`, {
    cache: 'no-store', // Ensure fresh data for admin pages
    headers: { // Forward the cookie
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    console.error('Failed to fetch categories for new entry form:', await res.text());
    return [];
  }
  try {
    const categories = await res.json();
    // Ensure _id is a string for client component props
    return categories.map((cat: any) => ({
        _id: cat._id.toString(),
        name: cat.name,
    }));
  } catch (e) {
    console.error('Failed to parse categories JSON for new entry form:', e);
    return [];
  }
}


export default async function NewFAQEntryPage() {
  const categories = await getCategories();

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Link
          href="/admin/faq/entries"
          className="inline-flex items-center gap-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back to FAQ Entries
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New FAQ Entry</h1>
      <div className="max-w-3xl"> {/* Increased max-width for editor */}
        {categories.length === 0 && (
            <div className="rounded-md bg-yellow-50 p-4 mb-4">
                <div className="flex">
                    <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        No FAQ categories found. Please{' '}
                        <Link href="/admin/faq/categories/new" className="font-medium text-yellow-800 underline hover:text-yellow-600">
                        create a category
                        </Link>{' '}
                        before adding an entry.
                    </p>
                    </div>
                </div>
            </div>
        )}
        <EntryForm categories={categories} />
      </div>
    </div>
  );
}