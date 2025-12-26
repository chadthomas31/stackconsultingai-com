# Stack Consulting AI

Modern, professional landing page for Stack Consulting AI - web development services for South Orange County businesses.

## Features

- **Modern Hero Section** with animated background and CTAs
- **Services Overview** showcasing web development, automation, e-commerce, and maintenance
- **Portfolio Grid** displaying 6 successful client projects
- **Contact Form** with Supabase integration for lead capture
- **Responsive Design** optimized for all devices
- **Dark Theme** with professional emerald green accents
- **SEO Optimized** with proper metadata and semantic HTML

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend for contact form submissions
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chadthomas31/stackconsultingai-com.git
cd stackconsultingai.com
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database:

Run this SQL in your Supabase SQL Editor:

```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create policy for admins to view submissions (optional)
CREATE POLICY "Admins can view all submissions"
  ON contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
stackconsultingai.com/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page (combines all components)
│   └── globals.css         # Global styles and theme
├── components/
│   ├── Hero.tsx            # Hero section
│   ├── Services.tsx        # Services grid
│   ├── Portfolio.tsx       # Portfolio showcase
│   ├── ContactForm.tsx     # Contact form with Supabase
│   └── Footer.tsx          # Footer with contact info
├── lib/
│   └── supabase.ts         # Supabase client setup
└── public/                 # Static assets
```

## Customization

### Update Contact Information

Edit `components/Footer.tsx`:
- Email: `contact@stackconsultingai.com`
- Phone: `(555) 123-4567`

### Update Portfolio Projects

Edit `components/Portfolio.tsx` to add/remove projects and update URLs.

### Change Color Theme

Edit `app/globals.css` to modify the color scheme:
- `--primary`: Main accent color (currently emerald green)
- `--background`: Background color
- Other CSS variables for fine-tuning

## License

© 2025 Stack Consulting AI. All rights reserved.

## Support

For questions or support, contact: contact@stackconsultingai.com