/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  // ✅ NOT inside experimental
  serverExternalPackages: [
    "mongoose",
    "bcryptjs",
    "jsonwebtoken",
    "socket.io",
    "@xenova/transformers"
  ],
};

export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         path: false,
//         crypto: false,
//       };
//     }
//     return config;
//   },
//   images: {
//     unoptimized: true,
//   },
// };

// export default nextConfig;
