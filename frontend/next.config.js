/** @type {import('next').NextConfig} */

const rewrites = async () => {
  return [
    {
      source: "/api/:path*",
      destination: "http://backend:8000/:path*",
    },
  ];
};

const nextConfig = { rewrites };

module.exports = nextConfig;
