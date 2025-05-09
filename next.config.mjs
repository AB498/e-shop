/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    // Allow image uploads up to 5MB
    experimental: {
        serverComponentsExternalPackages: ['sharp'],
    },
};

export default nextConfig;
