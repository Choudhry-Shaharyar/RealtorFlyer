/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'bqcpfwwmyxooktrdmyop.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },
    webpack: (config, { nextRuntime }) => {
        // Stub Node.js modules for Edge Runtime (middleware)
        // This fixes __dirname errors from @supabase/realtime-js -> ws
        if (nextRuntime === 'edge') {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
                stream: false,
                path: false,
                os: false,
            };
            config.resolve.alias = {
                ...config.resolve.alias,
                ws: false,
                bufferutil: false,
                'utf-8-validate': false,
            };
        }
        return config;
    },
};

export default nextConfig;

