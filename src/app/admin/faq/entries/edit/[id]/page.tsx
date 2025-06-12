import EntryForm from '@/components/admin/faq/EntryForm';
import { IFAQEntry } from '@/models/FAQEntry';
import { IFAQCategory } from '@/models/FAQCategory';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'; // Import headers

interface EditFAQEntryPageProps {
  params: {
    id: string;
  };
}

// Function to fetch a single entry by ID
async function getEntry(id: string): Promise<(IFAQEntry & { _id: string, category: { _id: string } }) | null> {
  const cookie = headers().get('cookie');
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/faq-entries/${id}`, {
    cache: 'no-store',
    headers: {
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    console.error(`Failed to fetch entry ${id}:`, await res.text());
    return null;
  }
  try {
    const entry = await res.json();
    // Ensure _id fields are strings
    return {
        ...entry,
        _id: entry._id.toString(),
        category: {
            ...entry.category,
            _id: entry.category._id.toString(),
        }
    };
  } catch (e) {
    console.error(`Failed to parse entry JSON for ${id}:`, e);
    return null;
  }
}

// Function to fetch categories
async function getCategories(): Promise<(Pick<IFAQCategory, '_id' | 'name'> & { _id: string })[]> {
  const cookie = headers().get('cookie'); // Also need cookie for this fetch
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/faq-categories`, {
    cache: 'no-store',
    headers: {
      ...(cookie && { Cookie: cookie }),
    },
  });

  if (!res.ok) {
    console.error('Failed to fetch categories for edit entry form:', await res.text());
    return [];
  }
  try {
    const categories = await res.json();
    return categories.map((cat: any) => ({
        _id: cat._id.toString(),
        name: cat.name,
    }));
  } catch (e) {
    console.error('Failed to parse categories JSON for edit entry form:', e);
    return [];
  }
}

export default async function EditFAQEntryPage({ params }: EditFAQEntryPageProps) {
  const { id } = params;
  const entry = await getEntry(id);
  const categories = await getCategories();

  if (!entry) {
    notFound();
  }

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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit FAQ Entry</h1>
      <div className="max-w-3xl">
        <EntryForm initialData={entry} categories={categories} />
      </div>
    </div>
  );
}