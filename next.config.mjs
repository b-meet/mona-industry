/** @type {import('next').NextConfig} */
const nextConfig = {
  // Not a static export any more: the site is served by Next.js on Vercel so
  // that the route handlers under app/api/ actually run. The browser talks to
  // this origin only — Supabase is reached server-side, and neither its URL nor
  // the service-role key enters the client bundle.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
