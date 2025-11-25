/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    domains: ['www.solarsystemscope.com', 'upload.wikimedia.org'],
  },
}

module.exports = nextConfig

