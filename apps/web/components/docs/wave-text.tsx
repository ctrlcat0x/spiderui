import { DocsPageLayout } from "@/components/docs-page-layout";
import {
  WaveTextPersonalizePanel,
  WaveTextPlayground,
} from "@/components/docs/previews/wave-text-playground";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { WaveText } from "@/components/ui/wave-text"`;

const usageCode = `export default function Page() {
  return (
    <h1 className="text-4xl font-semibold tracking-tight">
      <WaveText text="Move through the signal" preset="blocks" />
    </h1>
  )
}`;

export async function WaveTextDocs() {
  const sourceCode =
    (await readComponentSource("wave-text")) || "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Wave Text"
      description="A pointer-led character ripple that travels through text with configurable glyph sets."
      preview={<WaveTextPlayground />}
      personalizeContent={<WaveTextPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="wave-text"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/wave-text.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "text",
          type: "string",
          description: "Text that receives the pointer ripple.",
        },
        {
          name: "preset",
          type: '"letters" | "symbols" | "blocks"',
          default: '"symbols"',
          description: "Built-in glyph set used by the ripple.",
        },
        {
          name: "charset",
          type: "string",
          description: "Custom glyph set. Overrides the selected preset.",
        },
        {
          name: "duration",
          type: "number",
          default: "900",
          description: "Lifetime of each ripple in milliseconds.",
        },
        {
          name: "spread",
          type: "number",
          default: "1",
          description: "How quickly each ripple travels across the text.",
        },
        {
          name: "preserveSpaces",
          type: "boolean",
          default: "true",
          description: "Keep whitespace unchanged while a wave passes.",
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
