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
    "logo": "https://stackconsultingai.com/icon.svg",
    "image": "https://stackconsultingai.com/og-image.png",
    "founder": {
      "@type": "Person",
      "name": "Chad McCluskey"
    },
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "CA",
      "addressLocality": "South Orange County",
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
    "sameAs": [
      "https://stackconsultingai.com"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "3",
      "bestRating": "5"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Paul Ries" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Stack Consulting AI transformed our online presence. The booking system they built has increased our appointments by 40%. Their attention to detail and understanding of our business needs was exceptional."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Kate McCluskey" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Working with Stack Consulting AI was seamless. They delivered a beautiful, functional website that perfectly represents our brand. Our leads have doubled since launch."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "David Thompson" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "The project management portal they developed has streamlined our entire workflow. Communication was excellent throughout the project, and the final product exceeded expectations."
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
    />
  );
}
