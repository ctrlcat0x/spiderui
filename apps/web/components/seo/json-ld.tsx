export function JsonLd() {
  const siteUrl = "https://spiderui.dev"

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spider UI",
    url: siteUrl,
    logo: `${siteUrl}/logo_normal.png`,
    sameAs: [
      "https://github.com/ctrlcat0x/spiderui",
      "https://twitter.com/ctrlcat0x",
    ],
    founder: {
      "@type": "Person",
      name: "ctrlcat0X",
      url: "https://twitter.com/ctrlcat0x",
      sameAs: [
        "https://twitter.com/ctrlcat0x",
        "https://github.com/ctrlcat0x",
      ],
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Spider UI",
    alternateName: ["Spider UI", "Spider UI Components"],
    url: siteUrl,
    description:
      "Free, open-source React UI component library by ctrlcat0X. Beautiful, animated, copy-paste components.",
    publisher: {
      "@type": "Person",
      name: "ctrlcat0X",
      url: "https://twitter.com/ctrlcat0x",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/docs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Spider UI",
    description:
      "Premium React UI component library with beautiful animations. Copy-paste components built with Tailwind CSS, TypeScript, and Framer Motion.",
    url: siteUrl,
    codeRepository: "https://github.com/ctrlcat0x/spiderui",
    programmingLanguage: ["TypeScript", "JavaScript", "React", "CSS"],
    runtimePlatform: "Node.js",
    author: {
      "@type": "Person",
      name: "ctrlcat0X",
      url: "https://twitter.com/ctrlcat0x",
    },
    license: "https://opensource.org/licenses/MIT",
    operatingSystem: "Cross-platform",
    applicationCategory: "DeveloperApplication",
    keywords:
      "React, UI components, Tailwind CSS, TypeScript, Framer Motion, Next.js, component library",
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "ctrlcat0X",
    alternateName: ["ctrlcat0x", "ctrlcat0X"],
    url: "https://twitter.com/ctrlcat0x",
    jobTitle: "Frontend Developer",
    knowsAbout: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Next.js",
      "UI/UX Design",
      "Web Development",
      "Frontend Development",
    ],
    sameAs: [
      "https://twitter.com/ctrlcat0x",
      "https://github.com/ctrlcat0x",
      siteUrl,
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": siteUrl,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Components",
        item: `${siteUrl}/docs`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
