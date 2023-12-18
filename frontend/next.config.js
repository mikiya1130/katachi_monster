/** @type {import('next').NextConfig} */

const rewrites = async () => {
  return [
    {
      source: "/api/:path*",
      destination: "http://backend:8000/:path*",
    },
  ];
};

const headers = async () => {
  return [
    {
      source: "/images/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=604800, stale-while-revalidate=86400", // キャッシュは共有、7日間キャッシュ、1日間は変更確認せずキャッシュを返す
        },
      ],
    },
  ];
};

const nextConfig = { rewrites, headers };

module.exports = nextConfig;
