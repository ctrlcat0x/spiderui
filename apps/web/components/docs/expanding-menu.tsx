import { DocsPageLayout } from "@/components/docs-page-layout";
import { ExpandingMenuPreview } from "@/components/docs/previews/expanding-menu-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { ExpandingMenu } from "@/components/ui/expanding-menu"`;
const usageCode = `export default function Page() {
  return <ExpandingMenu onItemSelect={(item) => console.log(item.label)} />
}`;

export async function ExpandingMenuDocs() {
  const sourceCode =
    (await readComponentSource("expanding-menu")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Expanding Menu"
      description="A compact action button that springs into a responsive grid of customizable menu items."
      preview={<ExpandingMenuPreview />}
      previewCode={usageCode}
      installPackageName="expanding-menu"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/expanding-menu.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "ExpandingMenuItem[]",
          default: "Six default actions",
          description: "Icons, labels, and optional values shown in the grid.",
        },
        {
          name: "label",
          type: "string",
          default: "Add item",
          description:
            "Shared label for the collapsed button and expanded menu.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Sets the initial disclosure state.",
        },
        {
          name: "onItemSelect",
          type: "(item) => void",
          description: "Called when a menu item is selected.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the root wrapper.",
        },
      ]}
    />
  );
}
