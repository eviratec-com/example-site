/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ['eviratecphotos.blob.core.windows.net']
  }
}

module.exports = nextConfig
