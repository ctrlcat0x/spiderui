import { DocsPageLayout } from "@/components/docs-page-layout";
import { readComponentSource } from "@/lib/source-code";
import { RichButtonPreview } from "@/components/docs/previews/rich-button-preview";

const importCode = `import { RichButton } from "@/components/ui/rich-button"`;
const usageCode = `export default function Page() {
  return <RichButton color="orange">Continue</RichButton>
}`;

export async function RichButtonDocs() {
  const sourceCode =
    (await readComponentSource("rich-button")) ||
    "// Unable to load source code";
  return (
    <DocsPageLayout
      title="Rich Button"
      description="A tactile gradient button with inset highlights, color variants, responsive sizes, and press feedback."
      preview={<RichButtonPreview />}
      previewCode={usageCode}
      installPackageName="rich-button"
      installDependencies="@radix-ui/react-slot clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/rich-button.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "color",
          type: "RichButtonColor",
          default: "default",
          description: "Button color treatment.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description: "Merges button behavior into a single child element.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: "default",
          description: "Button height and text scale.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents interaction and dims the button.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the button.",
        },
      ]}
    />
  );
}
