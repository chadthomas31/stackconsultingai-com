export default function StructuredData() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://stackconsultingai.com/#organization",
    "name": "Stack Consulting AI",
    "description": "AI automation, custom web development, and business process automation for small businesses in Southern California and Orange County",
    "url": "https://stackconsultingai.com",
    "telephone": "+1-949-749-0001",
    "email": "hello@stackconsultingai.com",
    "logo": "https://stackconsultingai.com/stack-logo.png",
    "image": "https://stackconsultingai.com/og-image.png",
    "founder": {
      "@type": "Person",
      "name": "Chad McCluskey"
    },
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "CA",
      "addressLocality": "San Clemente",
      "postalCode": "92673",
      "addressCountry": "US"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "California"
      },
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "33.5",
          "longitude": "-117.7"
        },
        "geoRadius": "80000"
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    "priceRange": "$$",
    "serviceType": [
      "AI Consulting",
      "Web Development",
      "Business Automation",
      "E-commerce Development",
      "Website Maintenance"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "AI Automation",
      "Next.js",
      "TypeScript",
      "Supabase",
      "React",
      "Web Development",
      "Business Process Automation",
      "Southern California Web Development"
    ],
    // sameAs intentionally omitted until real external profiles exist (GBP, Yelp,
    // LinkedIn) — self-referencing sameAs is meaningless to Google.
    // aggregateRating/review removed: Google ignores self-serving review markup on
    // LocalBusiness and it risks a structured-data spam flag. Reviews belong on GBP.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
    />
  );
}
