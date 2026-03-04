import { Page } from 'puppeteer-core';
import { CheckResult } from '@/lib/types';

async function headCheck(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export async function runLaunchScan(
  page: Page,
  url: string,
  loadTimeMs: number
): Promise<CheckResult[]> {
  const origin = new URL(url).origin;

  // Collect all hrefs from the page
  const rawHrefs: string[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter(Boolean)
  );

  // Resolve and filter to HTTP(S) links only
  const links = rawHrefs
    .filter(
      (h) =>
        !h.startsWith('#') &&
        !h.startsWith('javascript:') &&
        !h.startsWith('mailto:') &&
        !h.startsWith('tel:')
    )
    .slice(0, 20)
    .map((h) => {
      try {
        return new URL(h, origin).toString();
      } catch {
        return null;
      }
    })
    .filter((h): h is string => h !== null);

  // Check everything in parallel
  const [robotsOk, sitemapOk, ...linkStatuses] = await Promise.all([
    headCheck(`${origin}/robots.txt`),
    headCheck(`${origin}/sitemap.xml`),
    ...links.map((l) => headCheck(l)),
  ]);

  const brokenCount = linkStatuses.filter((ok) => !ok).length;

  const loadStatus: CheckResult['status'] =
    loadTimeMs < 3000 ? 'pass' : loadTimeMs < 6000 ? 'amber' : 'fail';

  const viewportContent: string | null = await page.evaluate(
    () =>
      document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? null
  );
  const mobileOk =
    !!viewportContent &&
    viewportContent.includes('width=device-width') &&
    viewportContent.includes('initial-scale=1');

  return [
    {
      id: 'robots-txt',
      label: 'robots.txt',
      status: robotsOk ? 'pass' : 'amber',
      message: robotsOk
        ? 'robots.txt is accessible'
        : 'robots.txt not found — search engines won\'t know your crawl rules',
      fixHint: 'Create a robots.txt file at the root of your domain',
    },
    {
      id: 'sitemap',
      label: 'sitemap.xml',
      status: sitemapOk ? 'pass' : 'amber',
      message: sitemapOk
        ? 'sitemap.xml is accessible'
        : 'sitemap.xml not found — helps search engines index your content',
      fixHint: 'Create a sitemap.xml and submit it to Google Search Console',
    },
    {
      id: 'load-time',
      label: 'Page load time',
      status: loadStatus,
      message: `Page loaded in ${(loadTimeMs / 1000).toFixed(1)}s`,
      fixHint: 'Optimise images, minify assets, and use a CDN to reduce load times',
    },
    {
      id: 'broken-links',
      label: 'Broken links',
      status:
        brokenCount === 0 ? 'pass' : brokenCount <= 2 ? 'amber' : 'fail',
      message:
        brokenCount === 0
          ? `No broken links found (checked ${links.length})`
          : `${brokenCount} broken link(s) found (checked ${links.length})`,
      fixHint: 'Fix or remove broken links — they harm SEO and user experience',
    },
    {
      id: 'mobile-viewport',
      label: 'Mobile viewport',
      status: mobileOk ? 'pass' : 'fail',
      message: mobileOk
        ? 'Mobile viewport is correctly configured'
        : 'Mobile viewport meta tag is missing or misconfigured',
      fixHint:
        'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
    },
  ] satisfies CheckResult[];
}
