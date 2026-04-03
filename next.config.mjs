/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.cdn.filesafe.space' },
    ],
  },
  async redirects() {
    return [
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/menu', destination: '/menu', permanent: true },
      { source: '/en/live-music', destination: '/live-music', permanent: true },
      { source: '/en/about', destination: '/about', permanent: true },
      { source: '/en/reservation-confirmed', destination: '/reservation-confirmed', permanent: true },
      { source: '/en/contacts', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      { source: '/es/contacto', destination: '/es', permanent: true },
    ]
  },
};
export default nextConfig;
