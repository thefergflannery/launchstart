/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'puppeteer-core',
      '@sparticuz/chromium',
    ],
  },
  // Include the Chromium binary in serverless function bundles.
  // Without this, Vercel's file tracer misses the .tar.br binary and throws ENOENT.
  outputFileTracingIncludes: {
    '/api/scan':     ['./node_modules/@sparticuz/chromium/**/*'],
    '/api/alt-text': ['./node_modules/@sparticuz/chromium/**/*'],
  },
};

module.exports = nextConfig;
