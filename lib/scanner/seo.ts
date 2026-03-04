import { Page } from 'puppeteer-core';
import { CheckResult } from '@/lib/types';

export async function runSeoScan(page: Page, url: string): Promise<CheckResult[]> {
  const data = await page.evaluate(() => {
    const getMeta = (name: string) =>
      document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? null;
    const getOg = (prop: string) =>
      document.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') ?? null;
    const viewport =
      document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? null;

    return {
      hasMetaDescription: !!getMeta('description'),
      hasOgImage: !!getOg('og:image'),
      hasOgTitle: !!getOg('og:title'),
      viewport,
    };
  });

  const isHttps = url.startsWith('https://');
  const viewportOk =
    !!data.viewport &&
    data.viewport.includes('width=device-width') &&
    data.viewport.includes('initial-scale=1');

  return [
    {
      id: 'meta-description',
      label: 'Meta description',
      status: data.hasMetaDescription ? 'pass' : 'fail',
      message: data.hasMetaDescription
        ? 'Meta description is present'
        : 'No meta description found',
      fixHint: 'Add <meta name="description" content="…"> to <head>',
    },
    {
      id: 'og-image',
      label: 'OG image',
      status: data.hasOgImage ? 'pass' : 'amber',
      message: data.hasOgImage
        ? 'Open Graph image is set'
        : 'No OG image — links may look bland when shared on social',
      fixHint: 'Add <meta property="og:image" content="…"> to <head>',
    },
    {
      id: 'og-title',
      label: 'OG title',
      status: data.hasOgTitle ? 'pass' : 'amber',
      message: data.hasOgTitle
        ? 'Open Graph title is set'
        : 'No OG title — social shares will fall back to the page title',
      fixHint: 'Add <meta property="og:title" content="…"> to <head>',
    },
    {
      id: 'viewport',
      label: 'Viewport meta tag',
      status: viewportOk ? 'pass' : 'fail',
      message: viewportOk
        ? 'Viewport meta tag is correctly configured'
        : data.viewport
          ? 'Viewport meta tag exists but is misconfigured'
          : 'Viewport meta tag is missing',
      fixHint:
        'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
    },
    {
      id: 'https',
      label: 'HTTPS',
      status: isHttps ? 'pass' : 'fail',
      message: isHttps
        ? 'Site is served over HTTPS'
        : 'Site is not using HTTPS — data is sent unencrypted',
      fixHint: 'Configure your server to enforce HTTPS and redirect HTTP traffic',
    },
  ] satisfies CheckResult[];
}
