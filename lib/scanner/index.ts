import { ScanResults } from '@/lib/types';
import { fetchPage } from './fetch-page';
import { runAccessibilityScan } from './accessibility';
import { runSeoScan } from './seo';
import { runLaunchScan } from './launch';

export async function runScan(url: string): Promise<ScanResults> {
  const pageData = await fetchPage(url);

  // Accessibility and SEO can run in parallel — both read the DOM, no side-effects
  const [accessibility, seo, launch] = await Promise.all([
    Promise.resolve(runAccessibilityScan(pageData.$)),
    Promise.resolve(runSeoScan(pageData.$, pageData.finalUrl)),
    runLaunchScan(pageData),
  ]);

  return {
    url,
    scannedAt: new Date().toISOString(),
    accessibility,
    seo,
    launch,
  };
}
