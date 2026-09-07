import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { accent?: string };

function Glyph({ className, children, accent: _accent, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4.5 10.8 12 4.5l7.5 6.3V19a1.2 1.2 0 0 1-1.2 1.2h-4.3v-5.2H9.5V20.2H5.7A1.2 1.2 0 0 1 4.5 19V10.8Z" />
    </Glyph>
  );
}

export function DiscoverIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m15.6 15.6 4 4" />
    </Glyph>
  );
}

export function RegisterIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M8 5.5h8a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 16 20.5H8A1.5 1.5 0 0 1 6.5 19V7A1.5 1.5 0 0 1 8 5.5Z" />
      <path d="M10 5.5V4.8a2 2 0 0 1 4 0v.7" />
      <path d="m9.4 12.6 1.8 1.8 3.6-3.8" />
    </Glyph>
  );
}

export function FilingIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M7 19.5V7.2A1.2 1.2 0 0 1 8.2 6h5.1L17 9.6v9.9A1.2 1.2 0 0 1 15.8 20.7H8.2A1.2 1.2 0 0 1 7 19.5Z" />
      <path d="M13.2 6v3.6H17" />
    </Glyph>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4.5" y="6.5" width="15" height="13.5" rx="1.6" />
      <path d="M4.5 10.5h15M9 4.5v3.2M15 4.5v3.2" />
    </Glyph>
  );
}

export function TasksIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M9.5 7h10M9.5 12h10M9.5 17h7" />
      <path d="m4.5 7 1.3 1.3L8.2 5.8M4.5 12l1.3 1.3L8.2 10.8" />
    </Glyph>
  );
}

export function VaultIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4.5" y="8" width="15" height="12" rx="1.6" />
      <circle cx="12" cy="14" r="2.4" />
      <path d="M9 8V6.6A3 3 0 0 1 12 3.6 3 3 0 0 1 15 6.6V8" />
    </Glyph>
  );
}

export function ExpertsIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="9" cy="8.5" r="2.3" />
      <path d="M4.8 18c.5-2.8 2.3-4.2 4.2-4.2s3.7 1.4 4.2 4.2" />
      <circle cx="16.2" cy="9.2" r="2" />
      <path d="M13.2 18c.4-2.2 1.8-3.4 3-3.4s2.6 1.2 3 3.4" />
    </Glyph>
  );
}

export function ExposureIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 4.8 20.4 19.2H3.6L12 4.8Z" />
      <path d="M12 10v4.2" />
      <path d="M12 16.8h.01" />
    </Glyph>
  );
}

export function AdminIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3.4 13.1 5.8c.8-.15 1.55.02 2.25.4l2.15-1.35 1.5 2.6-1.7 1.85c.32.7.45 1.45.4 2.25L20.6 12l-2.4 1.1c.05.8-.08 1.55-.4 2.25l1.7 1.85-1.5 2.6-2.15-1.35c-.7.38-1.45.55-2.25.4L12 20.6l-1.1-2.4c-.8.15-1.55-.02-2.25-.4l-2.15 1.35-1.5-2.6 1.7-1.85c-.32-.7-.45-1.45-.4-2.25L3.4 12l2.4-1.1c-.05-.8.08-1.55.4-2.25L4.5 6.8l1.5-2.6 2.15 1.35c.7-.38 1.45-.55 2.25-.4L12 3.4Z" />
    </Glyph>
  );
}
