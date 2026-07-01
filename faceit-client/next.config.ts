import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	env: {
		SERVER_URL: process.env.SERVER_URL
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com'
			}
		]
	}
};

export default nextConfig;
