import { withWhopAppConfig } from "@whop/react/next.config";

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
};

export default withWhopAppConfig(nextConfig);
