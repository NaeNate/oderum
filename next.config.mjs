/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "hixirnwwe5bu8kts.public.blob.vercel-storage.com",
        protocol: "https",
      },
    ],
  },
}

export default config
