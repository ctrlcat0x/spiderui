import { DocsPageLayout } from "@/components/docs-page-layout";
import { TextRollPreview } from "@/components/docs/previews/text-roll-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { TextRoll } from "@/components/ui/text-roll"`;

const usageCode = `const components = ["tabs", "button", "dialog", "tooltip"]

export function Demo() {
  return (
    <div className="flex items-baseline gap-3 font-mono text-3xl">
      <span className="text-muted-foreground">$ npx shadcn add</span>
      <TextRoll items={components} interval={1500} />
    </div>
  )
}`;

export async function TextRollDocs() {
  const sourceCode =
    (await readComponentSource("text-roll")) || "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Text Roll"
      description="A compact 3D text rotator that rolls through words while reserving enough width for the longest item."
      preview={<TextRollPreview />}
      previewCode={usageCode}
      installPackageName="text-roll"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/text-roll.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "readonly string[]",
          description: "Words displayed by the rotating text slot.",
        },
        {
          name: "interval",
          type: "number",
          default: "1600",
          description: "Milliseconds between item changes.",
        },
        {
          name: "duration",
          type: "number",
          default: "0.45",
          description: "Duration of each roll transition, in seconds.",
        },
        {
          name: "initialIndex",
          type: "number",
          default: "0",
          description: "Item shown when the component first mounts.",
        },
        {
          name: "autoPlay",
          type: "boolean",
          default: "true",
          description: "Advance through the items automatically.",
        },
        {
          name: "loop",
          type: "boolean",
          default: "true",
          description: "Return to the first item after the last one.",
        },
        {
          name: "perspective",
          type: "number",
          default: "420",
          description: "CSS perspective used by the 3D roll.",
        },
        {
          name: "itemClassName",
          type: "string",
          description: "Classes applied to the animated item.",
        },
        {
          name: "onIndexChange",
          type: "(index: number) => void",
          description: "Called after the visible item advances.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes applied to the root span.",
        },
      ]}
    />
  );
}
