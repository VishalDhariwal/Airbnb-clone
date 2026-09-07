import React from "react";

export function AirbnbLogo({ className = "w-8 h-8 text-rausch" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.531-3.488 8.206-7.892 8.206-3.238 0-6.073-1.992-7.147-4.908l-.208-.601-.208.601c-1.074 2.916-3.909 4.908-7.147 4.908-4.404 0-7.892-3.675-7.892-8.206 0-1.208.318-2.428.971-3.711l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C9.037 1.963 10.492 1 12.5 1h3.5zm0 2.5h-3.5c-1.282 0-2.254.61-3.197 2.278l-.458.882c-1.928 3.78-6.046 12.404-7.009 14.654-.51 1.002-.736 1.83-.736 2.686 0 3.238 2.408 5.862 5.392 5.862 2.604 0 4.887-1.933 5.421-4.577l.08-.437h2.014l.08.437c.534 2.644 2.817 4.577 5.421 4.577 2.984 0 5.392-2.624 5.392-5.862 0-.856-.226-1.684-.736-2.686-.963-2.25-5.081-10.874-7.009-14.654l-.458-.882C18.254 4.11 17.282 3.5 16 3.5zm0 9.5c2.485 0 4.5 2.015 4.5 4.5 0 2.148-1.503 3.945-3.518 4.394l-.328.057-.654.049c-2.485 0-4.5-2.015-4.5-4.5 0-2.148 1.503-3.945 3.518-4.394l.328-.057.654-.049zm0 2c-1.381 0-2.5 1.119-2.5 2.5 0 1.258.924 2.298 2.128 2.474l.19.019.182-.019c1.204-.176 2.128-1.216 2.128-2.474 0-1.381-1.119-2.5-2.5-2.5z" />
    </svg>
  );
}

export function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    >
      <circle cx="13" cy="13" r="9" />
      <path d="M20 20l9 9" />
    </svg>
  );
}

export function GlobeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M8 0a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8zm0 14.5a6.5 6.5 0 1 1 6.5-6.5 6.51 6.51 0 0 1-6.5 6.5zM8 1.5a6.5 6.5 0 0 0-1.8 4.2h3.6A6.5 6.5 0 0 0 8 1.5zm-2 5.7a10.6 10.6 0 0 0 0 1.6h4a10.6 10.6 0 0 0 0-1.6zm2 7.3a6.5 6.5 0 0 0 1.8-4.2H6.2A6.5 6.5 0 0 0 8 14.5zm4.8-4.2a6.6 6.6 0 0 0 .4-1.5h-2.1a12.2 12.2 0 0 1-.3 1.5zm.4-3.1a6.6 6.6 0 0 0-.4-1.5h2.1a6.7 6.7 0 0 1 .4 1.5zm-9.6 0a6.6 6.6 0 0 0 .4 1.5H1.5a6.7 6.7 0 0 1 .4-1.5zm.4 3.1a6.6 6.6 0 0 0-.4 1.5H1.9a6.6 6.6 0 0 1-.4-1.5z" />
    </svg>
  );
}

export function MenuIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="M4 7h24M4 16h24M4 25h24" />
    </svg>
  );
}

export function UserAvatarIcon({ className = "w-7 h-7 text-muted" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M16 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 15c-6.627 0-12 4.03-12 9v1h24v-1c0-4.97-5.373-9-12-9zm0 2c5.347 0 9.774 3.107 9.988 7H6.012C6.226 21.107 10.653 18 16 18z" />
    </svg>
  );
}

export function CloseIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="M6 6l20 20M26 6L6 26" />
    </svg>
  );
}

export function StarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M16 1l4.47 9.06 10 1.45-7.24 7.06 1.71 9.96L16 23.83 7.06 28.53l1.71-9.96L1.53 11.51l10-1.45z" />
    </svg>
  );
}
