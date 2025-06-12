import LoginForm from '@/components/auth/LoginForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation'; // Corrected import for App Router

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  // The middleware should handle redirecting already authenticated admins away from /admin/login
  // if they try to access it directly.
  // The LoginForm component handles redirecting to /admin upon successful login.
  // Thus, this server-side redirect here can be removed to prevent potential loops.

  // if (session?.user?.role === 'admin') {
  //   redirect('/admin');
  // } else if (session) {
  //   // Non-admin logged in users trying to access /admin/login
  //   // Middleware should ideally handle this too, or they just see the form.
  // }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Admin Sign In
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}