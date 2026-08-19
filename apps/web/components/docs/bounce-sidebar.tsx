import { DocsPageLayout } from "@/components/docs-page-layout";
import { BounceSidebarPreview } from "@/components/docs/previews/bounce-sidebar-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { BounceSidebar } from "@/components/ui/bounce-sidebar"`;
const usageCode = `const items = [
  { id: "overview", label: "Overview" },
  { id: "components", label: "Components" },
  { id: "motion", label: "Motion" },
]

export default function Page() {
  return <BounceSidebar items={items} defaultValue="overview" />
}`;

export async function BounceSidebarDocs() {
  const sourceCode =
    (await readComponentSource("bounce-sidebar")) ||
    "// Unable to load source code";
  return (
    <DocsPageLayout
      title="Bounce Sidebar"
      description="A compact sidebar whose active indicator springs between navigation items with a subtle sideways bounce."
      preview={<BounceSidebarPreview />}
      previewCode={usageCode}
      installPackageName="bounce-sidebar"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/bounce-sidebar.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "BounceSidebarItem[]",
          description:
            "Navigation items with id, label, optional href, icon, and disabled state.",
        },
        {
          name: "value",
          type: "string",
          description: "Controlled selected item id.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial selected item id when uncontrolled.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called after the selected item changes.",
        },
        {
          name: "itemClassName",
          type: "string",
          description: "Additional classes shared by every navigation item.",
        },
        {
          name: "indicatorClassName",
          type: "string",
          description: "Additional classes for the animated indicator.",
        },
      ]}
    />
  );
}
