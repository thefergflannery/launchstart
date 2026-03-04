interface IconProps {
  className?: string;
  size?: number;
}

export function PassIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="0.75" y="0.75" width="14.5" height="14.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M4.5 8.5L6.5 10.5L11.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

export function FailIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="0.75" y="0.75" width="14.5" height="14.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M5 5L11 11M11 5L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function AmberIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="0.75" y="0.75" width="14.5" height="14.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M8 4.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <rect x="7.25" y="11" width="1.5" height="1.5" fill="currentColor" />
    </svg>
  );
}

export function LockIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2.75" y="7.25" width="10.5" height="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 7V5.5C5.5 3.843 6.343 3 8 3C9.657 3 10.5 3.843 10.5 5.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <rect x="7.25" y="10" width="1.5" height="2.5" fill="currentColor" />
    </svg>
  );
}

export function SparkleIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1L9.2 6.8L15 8L9.2 9.2L8 15L6.8 9.2L1 8L6.8 6.8L8 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" fill="currentColor" fillOpacity="0.15" />
      <path d="M13 2L13.6 4.4L16 5L13.6 5.6L13 8L12.4 5.6L10 5L12.4 4.4L13 2Z" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

export function CopyIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="5.75" y="0.75" width="9.5" height="9.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="0.75" y="5.75" width="9.5" height="9.5" fill="var(--tw-bg-opacity, white)" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ImagePlaceholderIcon({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 64 48" fill="none" className={className}>
      <rect x="1" y="1" width="62" height="46" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 35L18 20L30 30L41 22L63 36" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" />
      <rect x="40" y="10" width="10" height="10" rx="0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 15H22M10 20H18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}

export function ScanIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M1 5V1H5M15 1H19V5M19 15V19H15M5 19H1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M1 10H19" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
      <rect x="7" y="7" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = '', size = 12 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M5 2H2V10H10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
      <path d="M7 1H11V5M11 1L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}
