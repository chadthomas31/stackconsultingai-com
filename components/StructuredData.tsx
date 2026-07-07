export default function StructuredData() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://stackconsultingai.com/#organization",
    name: "Stack Consulting AI",
    description:
      "AI automation, custom web development, and business process automation for small businesses in Southern California and Orange County.",
    url: "https://stackconsultingai.com",
    telephone: "+19497490001",
    email: "hello@stackconsultingai.com",
    logo: "https://stackconsultingai.com/stack-logo.png",
    image: "https://stackconsultingai.com/og-image.png",
    founder: {
      "@type": "Person",
      name: "Chad McCluskey",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "2105 Avenida Espada",
      addressLocality: "San Clemente",
      addressRegion: "CA",
      postalCode: "92673",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.4259,
      longitude: -117.612,
    },
    areaServed: [
      "Orange County, CA",
      "San Clemente, CA",
      "Southern California",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    knowsAbout: [
      "AI Consulting",
      "AI Automation",
      "AI Receptionists",
      "Business Process Automation",
      "Custom Web Development",
      "Next.js",
      "TypeScript",
      "Supabase",
      "React",
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
