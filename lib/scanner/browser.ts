import puppeteer, { Browser } from 'puppeteer-core';

export async function launchBrowser(): Promise<Browser> {
  if (process.env.NODE_ENV === 'production') {
    // Use @sparticuz/chromium in Lambda / Vercel serverless
    const chromium = await import('@sparticuz/chromium');
    return puppeteer.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless as boolean,
    });
  }

  // Local development — try common Chrome paths
  const executablePath =
    process.env.CHROME_PATH ??
    (process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : '/usr/bin/google-chrome-stable');

  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}
