import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Or 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Basic CSP - can be made more restrictive.
          // Consider using a nonce-based or hash-based approach for inline scripts/styles if needed.
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
          // },
          // A more restrictive CSP might be:
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self';",
          // }
          // For NextAuth and potentially other client-side interactions, 'unsafe-inline' for styles and 'unsafe-eval' for scripts might be needed initially.
          // A common starting point that's reasonably secure but allows Next.js to function:
          {
            key: 'Content-Security-Policy',
            // Adjust 'unsafe-eval' and 'unsafe-inline' based on your needs and if you can refactor to avoid them.
            // For development, 'unsafe-eval' might be needed for HMR.
            // For production, aim to remove 'unsafe-eval' and minimize 'unsafe-inline'.
            value: "default-src 'self'; script-src 'self' " + (process.env.NODE_ENV === 'development' ? "'unsafe-eval' " : "") + "'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' vitals.vercel-insights.com;",
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // Deny by default
          },
          // Strict-Transport-Security - uncomment and configure if your site is HTTPS only
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=63072000; includeSubDomains; preload'
          // }
        ],
      },
    ];
  },
  /* other config options here */
};

export default nextConfig;
