import { CheerioAPI } from 'cheerio';
import { CheckResult } from '@/lib/types';

export function runSeoScan($: CheerioAPI, url: string): CheckResult[] {
  const hasMetaDescription =
    ($('meta[name="description"]').attr('content')?.trim().length ?? 0) > 0;
  const hasOgImage =
    ($('meta[property="og:image"]').attr('content')?.trim().length ?? 0) > 0;
  const hasOgTitle =
    ($('meta[property="og:title"]').attr('content')?.trim().length ?? 0) > 0;

  const viewport = $('meta[name="viewport"]').attr('content') ?? null;
  const viewportOk =
    !!viewport &&
    viewport.includes('width=device-width') &&
    viewport.includes('initial-scale=1');

  const isHttps = url.startsWith('https://');

  return [
    {
      id: 'meta-description',
      label: 'Meta description',
      status: hasMetaDescription ? 'pass' : 'fail',
      message: hasMetaDescription
        ? 'Meta description is present'
        : 'No meta description found',
      fixHint: 'Add <meta name="description" content="…"> to <head>',
    },
    {
      id: 'og-image',
      label: 'OG image',
      status: hasOgImage ? 'pass' : 'amber',
      message: hasOgImage
        ? 'Open Graph image is set'
        : 'No OG image — links may look bland when shared on social',
      fixHint: 'Add <meta property="og:image" content="…"> to <head>',
    },
    {
      id: 'og-title',
      label: 'OG title',
      status: hasOgTitle ? 'pass' : 'amber',
      message: hasOgTitle
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
        : viewport
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
