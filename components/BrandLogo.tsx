type Props = {
  className?: string;
};

export function BrandLogo({ className = "brand-logo" }: Props) {
  return (
    <picture className="brand-picture">
      <source media="(prefers-color-scheme: dark)" srcSet="/upcytech-logo-bluewhite.png" />
      <img src="/upcytech-logo-black.png" alt="UpcyTech" className={className} />
    </picture>
  );
}
