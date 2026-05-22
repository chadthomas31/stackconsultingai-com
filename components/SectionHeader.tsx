import type { ReactNode } from "react";

type Size = "default" | "large";
type Align = "left" | "center";

const TITLE_SIZE: Record<Size, string> = {
  default: "text-3xl md:text-4xl",
  large: "text-4xl md:text-5xl",
};

type Props = {
  /** Small uppercase eyebrow above the title (uses `.section-kicker`). */
  kicker?: string;
  title: ReactNode;
  /** Optional lead paragraph rendered below the title. */
  subtitle?: ReactNode;
  size?: Size;
  align?: Align;
  /** Bottom-margin spacing applied to the wrapping `<div>`. */
  marginBottom?: string;
  className?: string;
};

/**
 * Section heading triad: kicker + H2 + subtitle.
 *
 * Standardizes the SCA section header so every section uses the same type
 * ramp and tracking. Pair with `<Section>`.
 *
 *   <SectionHeader kicker="FAQ" title="Questions we get a lot." />
 *
 *   <SectionHeader
 *     kicker="Newsletter"
 *     title="The Stack Report"
 *     subtitle="Practical AI, business tech, and productivity — every other week."
 *     size="default"
 *   />
 */
export default function SectionHeader({
  kicker,
  title,
  subtitle,
  size = "default",
  align = "center",
  marginBottom = "mb-12",
  className = "",
}: Props) {
  const alignment = align === "center" ? "text-center" : "text-left";
  const wrapperClasses = [alignment, marginBottom, className]
    .filter(Boolean)
    .join(" ");
  const titleClasses = [
    "font-heading font-bold text-navy-900 tracking-tight",
    TITLE_SIZE[size],
    kicker ? "mt-2" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      {kicker ? <span className="section-kicker">{kicker}</span> : null}
      <h2 className={titleClasses}>{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
