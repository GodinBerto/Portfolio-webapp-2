/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploathing.com",
      "utfs.io",
      "img.clerk.com",
      "subdomain",
      "files.stripe.com",
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
