/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ibmcmrwzbejntporrerq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
