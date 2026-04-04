import { ecosystem } from "@mwenaro/config/ecosystem";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mwenaro Hub",
    "url": ecosystem.hub,
    "logo": `${ecosystem.hub}/logo.svg`,
    "description": "Mwenaro is Africa's premier technology ecosystem driving tech innovation in Kenya.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressLocality": "Mombasa"
    },
    "sameAs": [
      "https://twitter.com/mwenaro",
      "https://linkedin.com/company/mwenaro"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mwenaro",
    "url": ecosystem.hub,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${ecosystem.hub}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
