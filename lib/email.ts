import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'A11YO <hello@a11yo.com>';
const BASE_URL = 'https://a11yo.com';

// ─── Welcome email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to A11YO',
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'DM Sans',system-ui,sans-serif;color:#F5F4F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;">
          <a href="${BASE_URL}" style="font-family:monospace;font-size:18px;font-weight:700;color:#00E96A;text-decoration:none;letter-spacing:0.05em;">A11YO</a>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#161A16;border:1px solid #1E2A1E;padding:40px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#F5F4F0;letter-spacing:-0.03em;">You're in.</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#8FA88F;">
            Your A11YO account is ready. Paste any URL on the homepage and you'll have a plain English accessibility report in under a minute.
          </p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#8FA88F;">
            No jargon. No WCAG codes. Just a clear list of what needs fixing and how to fix it — something you can hand straight to your developer.
          </p>
          <a href="${BASE_URL}" style="display:inline-block;background:#00E96A;color:#0A0A0A;font-family:monospace;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;padding:14px 28px;">
            Run your first scan →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;">
          <p style="margin:0;font-family:monospace;font-size:11px;color:#7A957A;">
            A11YO · <a href="${BASE_URL}/privacy" style="color:#7A957A;">Privacy</a> · <a href="${BASE_URL}/terms" style="color:#7A957A;">Terms</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

// ─── Subscription confirmation ────────────────────────────────────────────────

const PLAN_NAMES: Record<string, string> = {
  onceoff:   'Action Plan',
  recurring: 'Recurring',
  agency:    'Agency',
};

const PLAN_DETAILS: Record<string, string> = {
  onceoff:   '10 scans per day, full scan history. No recurring charges — you\'re set for life.',
  recurring: '20 scans per day, score trend charts, Chrome extension access, and ongoing compliance monitoring.',
  agency:    'Unlimited scans per day, full site crawl, and everything in Recurring.',
};

export async function sendSubscriptionConfirmationEmail(to: string, plan: string) {
  const planName = PLAN_NAMES[plan] ?? plan;
  const planDetail = PLAN_DETAILS[plan] ?? 'Full access to A11YO.';

  await resend.emails.send({
    from: FROM,
    to,
    subject: `You're on the ${planName} plan`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'DM Sans',system-ui,sans-serif;color:#F5F4F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;">
          <a href="${BASE_URL}" style="font-family:monospace;font-size:18px;font-weight:700;color:#00E96A;text-decoration:none;letter-spacing:0.05em;">A11YO</a>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#161A16;border:1px solid #1E2A1E;padding:40px;">
          <p style="margin:0 0 8px;font-family:monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#00E96A;">${planName}</p>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#F5F4F0;letter-spacing:-0.03em;">Payment confirmed.</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#8FA88F;">
            ${planDetail}
          </p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#8FA88F;">
            Manage your billing or cancel any time from your account settings.
          </p>
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:12px;">
              <a href="${BASE_URL}" style="display:inline-block;background:#00E96A;color:#0A0A0A;font-family:monospace;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;padding:14px 28px;">
                Run a scan →
              </a>
            </td>
            <td>
              <a href="${BASE_URL}/account" style="display:inline-block;border:1px solid #1E2A1E;color:#8FA88F;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;padding:14px 28px;">
                Account settings
              </a>
            </td>
          </tr></table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;">
          <p style="margin:0;font-family:monospace;font-size:11px;color:#7A957A;">
            A11YO · <a href="${BASE_URL}/privacy" style="color:#7A957A;">Privacy</a> · <a href="${BASE_URL}/terms" style="color:#7A957A;">Terms</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
