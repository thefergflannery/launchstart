import { ScanResults } from '@/lib/types';
import { launchBrowser } from './browser';
import { runAccessibilityScan } from './accessibility';
import { runSeoScan } from './seo';
import { runLaunchScan } from './launch';

export async function runScan(url: string): Promise<ScanResults> {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    const loadTimeMs = Date.now() - startTime;

    // Accessibility and SEO can run in parallel (both read the DOM, no side-effects)
    const [accessibility, seo] = await Promise.all([
      runAccessibilityScan(page),
      runSeoScan(page, url),
    ]);

    // Launch scan runs after — it needs the load time and makes outbound fetch calls
    const launch = await runLaunchScan(page, url, loadTimeMs);

    return {
      url,
      scannedAt: new Date().toISOString(),
      accessibility,
      seo,
      launch,
    };
  } finally {
    await browser.close();
  }
}
