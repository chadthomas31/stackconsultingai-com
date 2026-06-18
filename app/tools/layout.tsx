import type { ReactNode } from "react";

// Tool pages don't render the homepage AnnouncementBar, so the fixed Navbar
// sits at top:0. Offset content below it (Navbar ≈ 64px) so breadcrumbs and
// headings aren't hidden under the bar. Uses --announcement-h in case an
// announcement is ever shown globally.
export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-[calc(var(--announcement-h,0px)+5rem)]">{children}</div>
  );
}
