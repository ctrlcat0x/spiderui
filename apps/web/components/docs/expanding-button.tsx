import { DocsPageLayout } from "@/components/docs-page-layout";
import { ExpandingButtonPreview } from "@/components/docs/previews/expanding-button-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { ExpandingButton } from "@/components/ui/expanding-button"`;
const usageCode = `export default function Page() {
  return (
    <ExpandingButton
      label="Choose view"
      options={["List", "Board", "Timeline"]}
      onSelect={(option) => console.log(option)}
    />
  )
}`;

export async function ExpandingButtonDocs() {
  const sourceCode =
    (await readComponentSource("expanding-button")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Expanding Button"
      description="A springy action button that dissolves into a compact row of choices."
      preview={<ExpandingButtonPreview />}
      previewCode={usageCode}
      installPackageName="expanding-button"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/expanding-button.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "label",
          type: "string",
          default: "Choose view",
          description: "Text shown on the collapsed button.",
        },
        {
          name: "options",
          type: "string[]",
          default: "List, Board, Timeline",
          description: "Choices revealed by the button.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Sets the initial expanded state.",
        },
        {
          name: "onSelect",
          type: "(option: string) => void",
          description: "Called when a choice is selected.",
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
