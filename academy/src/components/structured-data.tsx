import { ecosystem } from "@mwenaro/config/ecosystem";

export function CourseListSchema({ courses }: { courses: any[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": courses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": "Mwenaro Academy",
          "sameAs": ecosystem.academy
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function AcademyOrganizationSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Mwenaro Academy",
      "url": ecosystem.academy,
      "description": "Africa's leading software engineering bootcamp.",
      "brand": {
        "@type": "Brand",
        "name": "Mwenaro"
      }
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }
