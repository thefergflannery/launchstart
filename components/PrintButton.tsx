'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px', background: '#111', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
    >
      Save as PDF
    </button>
  );
}
