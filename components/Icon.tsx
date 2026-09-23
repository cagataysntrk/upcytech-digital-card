import type { SVGProps } from "react";

export type IconName =
  | "phone"
  | "mail"
  | "globe"
  | "linkedin"
  | "instagram"
  | "github"
  | "share"
  | "plus"
  | "arrow"
  | "qr";

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
};

export function Icon({ name, ...props }: Props) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M7.4 3.5 10 7.6 8.2 9.4c.9 2 2.5 3.6 4.5 4.5l1.8-1.8 4.1 2.6v2.1c0 1.1-.9 2-2 2C10.2 18.8 5.2 13.8 5.2 7.4c0-1.1.9-2 2-2h.2Z" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
        <path d="m5 7 7 5.5L19 7" />
      </svg>
    );
  }

  if (name === "globe") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 12h16.4M12 3.5c2.1 2.2 3.2 5 3.2 8.5S14.1 18.3 12 20.5C9.9 18.3 8.8 15.5 8.8 12S9.9 5.7 12 3.5Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 10v6M8 7.8v.1M11.5 16v-3.3c0-1.7 1-2.7 2.4-2.7 1.5 0 2.1 1 2.1 2.7V16M11.5 10.2V16" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="17.2" cy="6.9" r=".7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "github") {
    return (
      <svg {...common}>
        <path d="M9 19c-4.2 1.3-4.2-2.1-5.8-2.6M14.8 20v-3.1c0-.9.3-1.7.9-2.3 2.9-.3 5.9-1.4 5.9-6.3 0-1.4-.5-2.6-1.3-3.5.1-.3.6-1.7-.1-3.5 0 0-1.1-.3-3.6 1.3a12.5 12.5 0 0 0-6.5 0C7.6 1 6.5 1.3 6.5 1.3c-.7 1.8-.2 3.2-.1 3.5A5 5 0 0 0 5 8.3c0 4.9 3 6 5.9 6.3.5.5.8 1.2.8 2.1V20" />
      </svg>
    );
  }

  if (name === "share") {
    return (
      <svg {...common}>
        <circle cx="18" cy="5" r="2.2" />
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="18" cy="19" r="2.2" />
        <path d="m8 11 8-4.7M8 13l8 4.7" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (name === "qr") {
    return (
      <svg {...common}>
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
