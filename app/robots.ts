import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/account',
          '/admin',
          '/auth/',
          '/api/',
          '/report/',
        ],
      },
    ],
    sitemap: 'https://a11yo.com/sitemap.xml',
  };
}
