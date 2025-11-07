/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This will allow your project to build even if it has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;