"use client";

import { LineAccordion } from "@workspace/ui/components/line-accordion";

const items = [
  {
    id: "about",
    title: "What is Spider UI?",
    content:
      "Spider UI is an animated component registry for React and Next.js, with polished primitives you can copy, customize, and ship.",
  },
  {
    id: "install",
    title: "How do I install a component?",
    content:
      "Use the registry command from each component page, then tailor the copied source to your product and design tokens.",
  },
  {
    id: "styles",
    title: "Can I customize the styles?",
    content:
      "Yes. Every component exposes ordinary React props and className hooks, so it fits your existing visual system.",
  },
  {
    id: "motion",
    title: "Which animation library does it use?",
    content:
      "This component uses Motion for a soft height and icon transition, while honoring reduced-motion preferences.",
  },
];

export function LineAccordionPreview() {
  return (
    <div className="flex size-full min-h-[420px] items-center justify-center px-6 py-16 sm:px-10">
      <LineAccordion className="max-w-5xl" items={items} defaultValue="about" />
    </div>
  );
}
