/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfjs-dist tham chiếu module "canvas" chỉ dùng trên Node; trình duyệt không cần.
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
