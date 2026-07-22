"use client";

import {
  PreviewRail,
  type PreviewRailItem,
} from "@workspace/ui/components/preview-rail";

const previewItems: PreviewRailItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "See the system at a glance before exploring each part.",
  },
  {
    id: "examples",
    label: "Examples",
    description: "Start from practical patterns built for real interfaces.",
  },
  {
    id: "documentation",
    label: "Documentation",
    description: "Read installation, usage, and API reference notes.",
  },
  {
    id: "components",
    label: "Components",
    description: "Browse polished primitives for product interfaces.",
  },
  {
    id: "guides",
    label: "Guides",
    description:
      "Learn the small implementation details that make motion feel natural.",
  },
  {
    id: "changelog",
    label: "Changelog",
    description: "Keep track of new releases and improvements.",
  },
  {
    id: "tokens",
    label: "Design tokens",
    description: "Tune color, spacing, type, and motion from one place.",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description:
      "Ship keyboard-friendly experiences with reduced-motion support.",
  },
  {
    id: "community",
    label: "Community",
    description: "Share ideas, report issues, and help shape what comes next.",
  },
];

export function PreviewRailPreview() {
  return (
    <div className="flex min-h-[440px] w-full items-center justify-center px-5 py-12 sm:px-8">
      <PreviewRail
        items={previewItems}
        orientation="horizontal"
        defaultActiveId="guides"
        className="max-w-2xl"
      />
    </div>
  );
}
