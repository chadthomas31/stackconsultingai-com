import type { ReactNode } from "react";

type Tone = "white" | "soft" | "transparent";
type Width = "3xl" | "4xl" | "5xl" | "6xl" | "7xl";

const TONE: Record<Tone, string> = {
  white: "bg-white",
  soft: "bg-soft",
  transparent: "",
};

const WIDTH: Record<Width, string> = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

type Props = {
  id?: string;
  tone?: Tone;
  width?: Width;
  /** Extra classes appended to the outer <section>. */
  className?: string;
  /** Extra classes appended to the inner container. */
  innerClassName?: string;
  /** Replace the standard `py-20 md:py-28` vertical rhythm. */
  padding?: string;
  /** Optional ARIA label for landmark sections without a visible heading. */
  ariaLabel?: string;
  children: ReactNode;
};

/**
 * Standard marketing section wrapper.
 *
 * Encodes the SCA section canon: `py-20 md:py-28` vertical rhythm, centered
 * content container, palette tone background. See `CLAUDE.md` → Section Canon.
 *
 *   <Section id="faq" tone="soft" width="4xl">
 *     <SectionHeader kicker="FAQ" title="Questions we get a lot." />
 *     ...
 *   </Section>
 */
export default function Section({
  id,
  tone = "white",
  width = "6xl",
  className = "",
  innerClassName = "",
  padding = "py-20 md:py-28",
  ariaLabel,
  children,
}: Props) {
  const sectionClasses = [padding, TONE[tone], className].filter(Boolean).join(" ");
  const innerClasses = [WIDTH[width], "mx-auto px-4", innerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} aria-label={ariaLabel} className={sectionClasses}>
      <div className={innerClasses}>{children}</div>
    </section>
  );
}
