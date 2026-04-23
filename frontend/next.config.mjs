const apiOrigin = process.env.SENTINAI_API_ORIGIN || "http://127.0.0.1:9123";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      // OneDrive-backed folders can break webpack fs cache writes
      // and cause missing CSS/chunk 404s during `next dev`.
      config.cache = false;
    }
    return config;
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/process", destination: `${apiOrigin}/process` },
    ];
  },
};

export default nextConfig;

