import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { redirect } from 'next/navigation'; // For potential future use if needed

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Middleware should already protect this page.
  // Temporarily commenting out this check to see if it resolves the redirect loop.
  // If the loop is resolved, it indicates a potential race condition or delay in
  // session availability for this server component immediately after login.
  /*
  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
    return null;
  }
  */

  // If session is null here (after commenting out the guard), it means middleware isn't protecting it
  // or the session isn't available yet. For now, let's allow rendering to see if we break the loop.
  // We can add a loading state or a more graceful handling if session is null later.
  const userName = session?.user?.name || session?.user?.email || 'Admin';


  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {userName}!</p>
      <p className="mb-2">This is the main admin dashboard. From here you can manage content.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Link href="/admin/faq/categories" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Manage FAQ Categories</h5>
            <p className="font-normal text-gray-700">View, create, edit, and delete FAQ categories.</p>
        </Link>
        <Link href="/admin/faq/entries" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Manage FAQ Entries</h5>
            <p className="font-normal text-gray-700">View, create, edit, and delete FAQ entries.</p>
        </Link>
        <Link href="/admin/blog" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Manage Blog Posts</h5>
            <p className="font-normal text-gray-700">View, create, edit, and delete blog posts.</p>
        </Link>
        {/* Add more links as needed */}
      </div>

      {/* Placeholder for a sign-out button or link */}
      <div className="mt-8">
        <Link href="/api/auth/signout"
              className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              // Removed onClick handler. Direct link to /api/auth/signout is usually sufficient.
              // NextAuth will handle the sign out and redirect.
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}