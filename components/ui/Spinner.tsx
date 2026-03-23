'use client';

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Spinner({ size = 16, color = 'currentColor', className = '' }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={`spin ${className}`}
      style={{ color }}
    >
      <circle
        cx="8" cy="8" r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="28"
        strokeDashoffset="10"
        opacity="0.25"
      />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
