import { MetadataRoute } from 'next';

const BASE_URL = 'https://a11yo.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static marketing pages — highest priority
  const marketing: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/pricing`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/sample-report`,               lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/extension`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/why-a11yo`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/early-access`,                lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Free tools — high SEO value
  const tools: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/tools`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/alt-text`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tools/accessibility-statement`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Blog — medium priority, updated as posts are added
  const blog: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ];

  // Legal / accessibility
  const legal: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/accessibility`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  return [...marketing, ...tools, ...blog, ...legal];
}
