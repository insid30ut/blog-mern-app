import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/outline'; // Example icon
import { IFAQCategory } from '@/models/FAQCategory'; // Assuming this path is correct
import { headers } from 'next/headers'; // Import headers

// Function to fetch categories - replace with actual API call logic
// This would typically be an API call in a real app, or direct DB access if allowed by architecture
// For now, this is a placeholder. We'll use the API route we created.
async function getCategories(): Promise<IFAQCategory[]> {
  const cookie = headers().get('cookie');
  // In a real app, you'd fetch from your API endpoint
  // For example:
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/faq-categories`, {
    cache: 'no-store', // Ensure fresh data for admin pages
    headers: {
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error('Failed to fetch categories:', await res.text());
    // throw new Error('Failed to fetch categories');
    return []; // Return empty array on error for now
  }
  try {
    return await res.json();
  } catch (e) {
    console.error('Failed to parse categories JSON:', e);
    return [];
  }
}

export default async function AdminFAQCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">FAQ Categories</h1>
        <Link
          href="/admin/faq/categories/new"
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No FAQ categories found. Add one to get started!</p>
      ) : (
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Slug
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id?.toString() || category.slug}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{category.slug}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate max-w-xs">
                        {category.description || 'N/A'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link href={`/admin/faq/categories/edit/${category._id?.toString() || category.slug}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {category.name}</span>
                        </Link>
                        {/* Delete button/modal would go here, typically a client component */}
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