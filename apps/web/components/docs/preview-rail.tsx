import { DocsPageLayout } from "@/components/docs-page-layout";
import { PreviewRailPreview } from "@/components/docs/previews/preview-rail-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { PreviewRail } from "@/components/ui/preview-rail"`;

const usageCode = `const items = [
  {
    id: "docs",
    label: "Documentation",
    description: "Read installation, usage, and API reference notes.",
  },
  {
    id: "components",
    label: "Components",
    description: "Browse polished interface primitives.",
  },
]

export function Demo() {
  return <PreviewRail items={items} orientation="horizontal" />
}`;

export async function PreviewRailDocs() {
  const sourceCode =
    (await readComponentSource("preview-rail")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Preview Rail"
      description="A responsive rail navigator with spring-scaled markers and blur-fade preview swaps."
      preview={<PreviewRailPreview />}
      previewCode={usageCode}
      installPackageName="preview-rail"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/preview-rail.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "PreviewRailItem[]",
          description:
            "Rail entries with id, label, optional description, and optional link settings.",
        },
        {
          name: "orientation",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          description: "Places the marker rail beside or below the preview.",
        },
        {
          name: "activeId",
          type: "string",
          description: "Controlled active item id.",
        },
        {
          name: "defaultActiveId",
          type: "string",
          description: "Initial active item id for uncontrolled usage.",
        },
        {
          name: "onActiveChange",
          type: "(id: string) => void",
          description: "Called when an item is selected.",
        },
        {
          name: "renderPreview",
          type: "(item: PreviewRailItem) => ReactNode",
          description:
            "Renders custom content inside the animated preview slot.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Optional content placed beside the vertical rail.",
        },
        {
          name: "railClassName",
          type: "string",
          description: "Additional classes for the marker rail.",
        },
        {
          name: "previewClassName",
          type: "string",
          description: "Additional classes for the animated preview area.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the component root.",
        },
      ]}
    />
  );
}
