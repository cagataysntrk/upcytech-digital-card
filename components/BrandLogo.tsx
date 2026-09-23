type Props = {
  className?: string;
};

export function BrandLogo({ className = "brand-logo" }: Props) {
  return (
    <span className={`brand-lockup ${className}`} aria-label="UpcyTech">
      <img
        src="/upcytech-mark-official.png"
        alt=""
        className="brand-mark"
        aria-hidden="true"
      />
      <span className="brand-wordmark">UpcyTech</span>
    </span>
  );
}
