import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'A11YO — Free Accessibility & WCAG 2.2 Checker for Websites';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080D08',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'monospace',
        }}
      >
        {/* Top label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#00E96A', fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Accessibility · SEO · EAA 2025
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ color: '#00E96A', fontSize: '72px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
            A11YO
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 600, maxWidth: '800px', lineHeight: 1.2 }}>
            The fast accessibility checker for websites.
          </div>
          <div style={{ color: '#7A957A', fontSize: '20px', maxWidth: '700px', lineHeight: 1.5 }}>
            Paste a URL. Get a full WCAG 2.2 AA audit in under 30 seconds — with plain-English fixes for every issue.
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#3D5C3D', fontSize: '14px', letterSpacing: '0.1em' }}>a11yo.com</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Free to start', 'No account needed', 'WCAG 2.2 AA'].map((tag) => (
              <span
                key={tag}
                style={{
                  color: '#7A957A',
                  fontSize: '12px',
                  border: '1px solid #1E2E1E',
                  padding: '4px 12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
