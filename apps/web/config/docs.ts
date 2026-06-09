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
  "Carousels",
  "Text Effects",
  "Card Interactions",
  "Logo Clouds",
  "Pricing",
  "Visual Effects",
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

  Object.keys(groups).forEach((key) => {
    const category = key as keyof typeof groups;
    const categoryComponents = Object.values(components).filter(
      (c) => c.category === category,
    );
    groups[category]!.items.sort((a, b) => {
      const compA = categoryComponents.find((c) => c.title === a.title);
      const compB = categoryComponents.find((c) => c.title === b.title);
      if (!compA || !compB) return a.title.localeCompare(b.title);
      return compareComponentsInCategory(compA, compB);
    });
  });

  // Return groups in defined order
  return categoryOrder
    .map((category) => groups[category])
    .filter(Boolean) as NavGroup[];
};

const getLlmsText = () => {
  const baseUrl = "https://spiderui.dev";
  let text = `# Spider UI

> Spider UI is a collection of beautifully-designed, accessible components and visual effects. It is built with TypeScript, Tailwind CSS, and Framer Motion. Open Source. Copy and paste into your apps.

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
