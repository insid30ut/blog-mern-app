import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { IFAQEntry } from '@/models/FAQEntry';
import { IFAQCategory } from '@/models/FAQCategory'; // For populated category type
import { headers } from 'next/headers'; // Import headers

interface PopulatedFAQEntry extends Omit<IFAQEntry, 'category'> {
  _id: string; // Ensure _id is always a string after fetch
  category: Pick<IFAQCategory, '_id' | 'name' | 'slug'> & { _id: string }; // Ensure category _id is string
}


async function getFAQEntries(): Promise<PopulatedFAQEntry[]> {
  const cookie = headers().get('cookie');
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/faq-entries`, {
    cache: 'no-store', // Ensure fresh data for admin pages
    headers: {
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    console.error('Failed to fetch FAQ entries:', await res.text());
    return [];
  }
  try {
    // The API returns category populated, ensure types match
    const entries = await res.json();
    return entries.map((entry: any) => ({
      ...entry,
      _id: entry._id?.toString(),
      category: {
        ...entry.category,
        _id: entry.category?._id?.toString(),
      }
    })) as PopulatedFAQEntry[];
  } catch (e) {
    console.error('Failed to parse FAQ entries JSON:', e);
    return [];
  }
}

export default async function AdminFAQEntriesPage() {
  const entries = await getFAQEntries();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">FAQ Entries</h1>
        <Link
          href="/admin/faq/entries/new"
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          New FAQ Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-500">No FAQ entries found. Add one to get started!</p>
      ) : (
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Question
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Slug
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Published
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr key={entry._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 max-w-md truncate">
                        {entry.question}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.category?.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{entry.slug}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.isPublished ? 'Yes' : 'No'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link href={`/admin/faq/entries/edit/${entry._id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {entry.question}</span>
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