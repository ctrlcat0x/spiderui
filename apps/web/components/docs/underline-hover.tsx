import { DocsPageLayout } from "@/components/docs-page-layout";
import { UnderlineHoverPreview } from "@/components/docs/previews/underline-hover-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { UnderlineHover } from "@/components/ui/underline-hover"`;

const usageCode = `export function Demo() {
  return (
    <UnderlineHover
      href="/about"
      underlineColor="#ff4b2b"
      className="text-5xl"
    >
      Hover me
    </UnderlineHover>
  )
}`;

export async function UnderlineHoverDocs() {
  const sourceCode =
    (await readComponentSource("underline-hover")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Underline Hover"
      description="A hand-drawn underline that sketches in on hover or keyboard focus and cycles through organic stroke shapes."
      preview={<UnderlineHoverPreview />}
      previewCode={usageCode}
      installPackageName="underline-hover"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/underline-hover.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "children",
          type: "React.ReactNode",
          description: "Link content displayed above the underline.",
        },
        {
          name: "duration",
          type: "number",
          default: "0.5",
          description: "Draw and erase duration, in seconds.",
        },
        {
          name: "paths",
          type: "readonly string[]",
          default: "6 included paths",
          description: "SVG path shapes cycled between interactions.",
        },
        {
          name: "underlineColor",
          type: "string",
          default: '"currentColor"',
          description: "CSS color used for the underline stroke.",
        },
        {
          name: "strokeWidth",
          type: "number",
          default: "10",
          description: "Width of the SVG underline stroke.",
        },
        {
          name: "textClassName",
          type: "string",
          description: "Classes applied to the text wrapper.",
        },
        {
          name: "underlineClassName",
          type: "string",
          description: "Classes applied to the underline container.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes applied to the anchor.",
        },
      ]}
    />
  );
}
