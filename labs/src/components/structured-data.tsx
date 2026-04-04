import { ecosystem } from "@mwenaro/config/ecosystem";

export function LabsOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mwenaro Labs",
    "url": ecosystem.labs,
    "logo": `${ecosystem.hub}/logo.svg`,
    "description": "Custom software development studio building scalable digital products for fast-growing companies and enterprises.",
    "brand": {
      "@type": "Brand",
      "name": "Mwenaro"
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

export function LabsWebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mwenaro Labs",
    "url": ecosystem.labs
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
