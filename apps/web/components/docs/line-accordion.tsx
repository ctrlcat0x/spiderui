import { DocsPageLayout } from "@/components/docs-page-layout";
import { LineAccordionPreview } from "@/components/docs/previews/line-accordion-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { LineAccordion } from "@/components/ui/line-accordion"`;

const usageCode = `const items = [
  {
    id: "shipping",
    title: "How quickly can I ship?",
    content: "Copy the source, add your content, and adjust the classes.",
  },
  {
    id: "control",
    title: "Can I control the active item?",
    content: "Yes. Pass value and onValueChange.",
  },
]

export function Demo() {
  return <LineAccordion items={items} defaultValue="shipping" />
}`;

export async function LineAccordionDocs() {
  const sourceCode =
    (await readComponentSource("line-accordion")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Line Accordion"
      description="A restrained FAQ accordion with dividing lines, smooth height transitions, and a plus-to-minus indicator."
      preview={<LineAccordionPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="line-accordion"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/line-accordion.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "LineAccordionItem[]",
          description:
            "Rows with an id, title, content, and optional disabled state.",
        },
        {
          name: "value",
          type: "string | string[]",
          description: "Controlled open item ids.",
        },
        {
          name: "defaultValue",
          type: "string | string[]",
          description: "Initial open item ids for uncontrolled state.",
        },
        {
          name: "onValueChange",
          type: "(value: string[]) => void",
          description: "Runs whenever the open item ids change.",
        },
        {
          name: "allowMultiple",
          type: "boolean",
          default: "false",
          description: "Allow several items to remain open at once.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the accordion wrapper.",
        },
      ]}
    />
  );
}
