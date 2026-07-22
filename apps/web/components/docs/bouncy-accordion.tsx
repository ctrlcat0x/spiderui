import { DocsPageLayout } from "@/components/docs-page-layout";
import { BouncyAccordionPreview } from "@/components/docs/previews/bouncy-accordion-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { BouncyAccordion } from "@/components/ui/bouncy-accordion"`;

const usageCode = `const items = [
  {
    id: "shipping",
    title: "How quickly can I ship?",
    description: "Copy the component, add your content, and customize its slots.",
  },
  {
    id: "controlled",
    title: "Can I control the open row?",
    description: "Yes. Pass value and onValueChange.",
  },
]

export function Demo() {
  return <BouncyAccordion items={items} defaultValue="shipping" />
}`;

export async function BouncyAccordionDocs() {
  const sourceCode =
    (await readComponentSource("bouncy-accordion")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Bouncy Accordion"
      description="Spring-grouped FAQ rows with controlled state, optional icons, disabled items, and customizable slots."
      preview={<BouncyAccordionPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="bouncy-accordion"
      installDependencies="motion lucide-react clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/bouncy-accordion.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "BouncyAccordionItem[]",
          description:
            "Rows with id, title, description, icon, and disabled state.",
        },
        {
          name: "value",
          type: "string | null",
          description: "Controlled id of the open row.",
        },
        {
          name: "defaultValue",
          type: "string | null",
          default: "null",
          description: "Initially open row for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(value: string | null) => void",
          description: "Runs when the open row changes.",
        },
        {
          name: "collapsible",
          type: "boolean",
          default: "true",
          description: "Allows the active row to close.",
        },
        {
          name: "classNames",
          type: "BouncyAccordionClassNames",
          description: "Classes for each visual slot.",
        },
      ]}
    />
  );
}
