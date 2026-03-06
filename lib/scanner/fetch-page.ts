import * as cheerio from 'cheerio';

export interface PageData {
  $: cheerio.CheerioAPI;
  html: string;
  loadTimeMs: number;
  url: string;
  finalUrl: string;
}

export async function fetchPage(url: string): Promise<PageData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  const start = Date.now();
  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; A11YO-Scanner/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });
  } finally {
    clearTimeout(timer);
  }

  const loadTimeMs = Date.now() - start;
  const html = await response.text();
  const $ = cheerio.load(html);

  return { $, html, loadTimeMs, url, finalUrl: response.url };
}
