import { DocsPageLayout } from "@/components/docs-page-layout";
import { MotionAccordionPreview } from "@/components/docs/previews/motion-accordion-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { MotionAccordion } from "@/components/ui/motion-accordion"`;

const usageCode = `const items = [
  {
    question: "Can I use this commercially?",
    answer: "Yes. Customize it and ship it in any project.",
  },
  {
    question: "Does it support dynamic answers?",
    answer: "Yes. Content height is measured automatically.",
  },
]

export function Demo() {
  return <MotionAccordion items={items} gap={10} />
}`;

export async function MotionAccordionDocs() {
  const sourceCode =
    (await readComponentSource("motion-accordion")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Motion Accordion"
      description="Rounded FAQ accordion with spring height, scale, and plus-to-minus transitions."
      preview={<MotionAccordionPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="motion-accordion"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/motion-accordion.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "MotionAccordionItem[]",
          description: "Question and answer content for every FAQ row.",
        },
        {
          name: "gap",
          type: "number",
          default: "10",
          description: "Pixel gap between accordion cards.",
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
