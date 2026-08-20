import { DocsPageLayout } from "@/components/docs-page-layout";
import { FeedbackInputPreview } from "@/components/docs/previews/feedback-input-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { FeedbackInput } from "@/components/ui/feedback-input"`;
const usageCode = `export default function Page() {
  return (
    <FeedbackInput
      defaultValue={4}
      onValueChange={(value, option) => console.log(value, option.label)}
    />
  )
}`;

export async function FeedbackInputDocs() {
  const sourceCode =
    (await readComponentSource("feedback-input")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Feedback Input"
      description="A playful satisfaction meter with a collision-aware emoji picker, drag selection, keyboard controls, and animated feedback bursts."
      preview={<FeedbackInputPreview />}
      previewCode={usageCode}
      installPackageName="feedback-input"
      installDependencies="motion @radix-ui/react-slot clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/feedback-input.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "options",
          type: "FeedbackOption[]",
          default: "Five satisfaction levels",
          description:
            "Satisfaction values, native emoji, and accessible labels.",
        },
        {
          name: "value",
          type: "number",
          description: "Controlled satisfaction value.",
        },
        {
          name: "defaultValue",
          type: "number",
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(value, option) => void",
          description: "Called whenever a satisfaction level is selected.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: "md",
          description: "Controls the trigger, picker, and burst size.",
        },
        {
          name: "align",
          type: '"left" | "center" | "right"',
          default: "center",
          description: "Aligns the picker to its trigger.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description: "Uses the child element as the trigger.",
        },
      ]}
    />
  );
}
