import { ecosystem } from "@mwenaro/config/ecosystem";

export function TalentOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RecruitmentFirm",
    "name": "Mwenaro Talent",
    "url": ecosystem.talent,
    "logo": `${ecosystem.hub}/logo.svg`,
    "description": "Hire vetted, project-ready software engineers and data scientists in Kenya and across Africa.",
    "parentOrganization": {
      "@type": "Organization",
      "name": "Mwenaro",
      "url": ecosystem.hub
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

export function TalentWebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mwenaro Talent",
    "url": ecosystem.talent
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
