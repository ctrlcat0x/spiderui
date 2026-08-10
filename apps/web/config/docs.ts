import {
  compareComponentsInCategory,
  components,
  getComponentDocsHref,
} from "@/registry";

type NavItem = {
  title: string;
  href: string;
  items?: NavItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const gettingStarted: NavGroup = {
  title: "Getting Started",
  items: [
    {
      title: "Introduction",
      href: "/docs",
    },
    {
      title: "Templates",
      href: "/docs/templates",
    },
  ],
};

const categoryOrder = [
  "Primitives",
  "Components",
  "AI Input",
  "Carousels",
  "Text Effects",
  "Backgrounds",
  "Card Interactions",
  "Logo Clouds",
  "Pricing",
  "Visual Interactions",
  "FAQ",
];

const getComponentNav = (): NavGroup[] => {
  const groups: Record<string, NavGroup> = {};

  Object.values(components).forEach((component) => {
    if (!groups[component.category]) {
      groups[component.category] = {
        title: component.category,
        items: [],
      };
    }
    groups[component.category]!.items.push({
      title: component.title,
      href: getComponentDocsHref(component.slug),
    });
  });

  Object.values(groups).forEach((group) => {
    group.items.sort((a, b) => a.title.localeCompare(b.title));
  });

  // Return groups in defined order
  return categoryOrder
    .map((category) => groups[category])
    .filter(Boolean) as NavGroup[];
};

const getLlmsText = () => {
  const baseUrl = "https://spiderui.dev";
  let text = `# Spider UI

> Spider UI is a collection of beautifully-designed, accessible components and visual interactions. It is built with TypeScript, Tailwind CSS, and Framer Motion. Open Source. Copy and paste into your apps.

## Overview`;

  gettingStarted.items.forEach((item) => {
    const blurb =
      item.title === "Templates"
        ? "Full starter templates you can clone and ship."
        : "Getting started with Spider UI.";
    text += `\n- [${item.title}](${baseUrl}${item.href}): ${blurb}`;
  });

  text += `\n\n## Components`;

  categoryOrder.forEach((category) => {
    text += `\n\n### ${category}\n\n`;
    const categoryComponents = Object.values(components)
      .filter((c) => c.category === category)
      .sort(compareComponentsInCategory);

    categoryComponents.forEach((component) => {
      text += `- [${component.title}](${baseUrl}${getComponentDocsHref(component.slug)}): ${component.description}\n`;
    });
  });

  return text;
};

// Pre-compute nav at module load time (runs once)
const componentNav = getComponentNav();
const flatComponentNav = componentNav.flatMap((group) => group.items);
const llmsText = getLlmsText();
const precomputedNav = Object.freeze([gettingStarted, ...componentNav]);

export const docsConfig = {
  nav: precomputedNav,
  flatComponentNav,
  llms: {
    text: llmsText,
  },
} as const;
