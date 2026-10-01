import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }, { protocol: "https", hostname: "github.com" }, { protocol: "https", hostname: "i.pinimg.com" }] },
  async redirects() {
    return [
      { source: '/design-system', destination: '/admin/design-system', permanent: true },
      { source: '/mensagens', destination: '/admin/mensagens', permanent: true },
    ];
  },
};

export default nextConfig;
