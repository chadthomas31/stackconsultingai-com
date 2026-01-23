export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Stack Consulting AI",
    "description": "AI automation and custom websites for small businesses in South Orange County",
    "url": "https://stackconsultingai.com",
    "telephone": "+1-949-804-8225",
    "email": "hello@stackconsultingai.com",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "CA",
      "addressLocality": "South Orange County",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "33.5",
        "longitude": "-117.7"
      },
      "geoRadius": "50000"
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
      "Web Development"
    ],
    "sameAs": [
      "https://stackconsultingai.com"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
