# stackconsultingai.com

## Design Context

### Users
Small business owners in Southern California / Orange County evaluating AI consulting, web development, or automation services. Non-technical decision-makers who scan quickly for credibility before reaching out.

### Brand Personality
**Bold, Innovative, Fast.** Confident, direct voice — speaks like a builder, not a marketer.

### Emotional Goals
- **Confidence & Trust** — immediate credibility
- **Innovation & Edge** — forward-thinking, modern tech

### Aesthetic Direction
- Dark mode only. Vercel/Linear-inspired minimalism
- Deep navy-black backgrounds, emerald green primary accent
- Inter font. Lucide icons. Glass-blur surfaces, subtle grid patterns
- Purposeful animations only (< 700ms). No decorative motion
- Anti-references: generic WordPress themes, stock-photo corporate sites, pastel/playful SaaS designs

### Design Principles
1. **Ship signal, not noise.** Every element earns its place
2. **Dark and sharp.** Emerald green used sparingly to draw attention to CTAs and key elements
3. **Speed is felt.** Fast animations, smooth transitions, minimal page weight
4. **Technical credibility through craft.** The site IS the portfolio
5. **Clarity over cleverness.** Scannable copy, outcomes over jargon

### Accessibility
- WCAG AA compliance (4.5:1 body text, 3:1 large text/UI)
- Keyboard navigation, semantic HTML, ARIA labels
- Respect `prefers-reduced-motion`

### Token System
CSS custom properties in `app/globals.css` (shadcn/ui pattern): `--primary` (emerald), `--background`/`--foreground`, `--card`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--ring`, `--radius` (0.5rem).
