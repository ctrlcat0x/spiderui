"use client";

import { BounceSidebar } from "@workspace/ui/components/bounce-sidebar";

const items = [
  { id: "overview", label: "Overview" },
  { id: "components", label: "Components" },
  { id: "motion", label: "Motion" },
  { id: "templates", label: "Templates" },
  { id: "changelog", label: "Changelog" },
];

export function BounceSidebarPreview() {
  return (
    <div className="flex min-h-[440px] w-full items-center justify-center px-8 py-16">
      <BounceSidebar items={items} className="w-64" itemClassName="text-xl" />
    </div>
  );
}
