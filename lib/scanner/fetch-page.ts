import * as cheerio from 'cheerio';

export interface PageData {
  $: cheerio.CheerioAPI;
  html: string;
  loadTimeMs: number;
  url: string;
  finalUrl: string;
}

/** Block requests to private/internal hosts (SSRF protection) */
function assertPublicHost(url: string): void {
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error('Invalid URL'); }

  const h = parsed.hostname.toLowerCase();
  if (h === 'localhost' || h === '::1' || h === '[::1]') {
    throw new Error('Invalid URL');
  }
  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (
      a === 127 ||                            // loopback
      a === 10 ||                             // RFC1918
      (a === 172 && b >= 16 && b <= 31) ||    // RFC1918
      (a === 192 && b === 168) ||             // RFC1918
      (a === 169 && b === 254) ||             // link-local / AWS metadata
      a === 0 ||                              // 0.0.0.0/8
      (a === 100 && b >= 64 && b <= 127)      // CGNAT / RFC6598
    ) {
      throw new Error('Invalid URL');
    }
  }
}

export async function fetchPage(url: string): Promise<PageData> {
  assertPublicHost(url);

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
