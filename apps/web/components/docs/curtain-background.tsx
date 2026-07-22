import { DocsPageLayout } from "@/components/docs-page-layout";
import { CurtainBackgroundPreview } from "@/components/docs/previews/curtain-background-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { CurtainBackground } from "@/components/ui/curtain-background"`;

const usageCode = `export function Demo() {
  return (
    <div className="h-[420px] overflow-hidden rounded-3xl">
      <CurtainBackground
        colors={["#ef4444", "#dc2626", "#b91c1c"]}
        speed={0.3}
        grain={0.6}
      />
    </div>
  )
}`;

export async function CurtainBackgroundDocs() {
  const sourceCode =
    (await readComponentSource("curtain-background")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Curtain Background"
      description="A flowing simplex-noise field with layered crimson light, animated grain, and a soft vignette."
      preview={<CurtainBackgroundPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="curtain-background"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/curtain-background.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      usageNote={
        <p className="text-sm leading-relaxed text-muted-foreground">
          Place the component in a container with an explicit height. Content
          passed as children stays above the animated fabric.
        </p>
      }
      props={[
        {
          name: "colors",
          type: "readonly string[]",
          default: '["#ef4444", "#dc2626", "#b91c1c"]',
          description: "Primary, light, and base colors for the noise field.",
        },
        {
          name: "speed",
          type: "number",
          default: "0.3",
          description: "Multiplier for the fabric drift animation.",
        },
        {
          name: "grain",
          type: "number",
          default: "0.6",
          description: "Strength of the animated surface grain.",
        },
        {
          name: "height",
          type: "string | number",
          default: '"100%"',
          description: "CSS height of the background container.",
        },
        {
          name: "paused",
          type: "boolean",
          default: "false",
          description:
            "Render a still frame without running the animation loop.",
        },
        {
          name: "children",
          type: "React.ReactNode",
          description: "Optional content rendered above the canvas.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the root container.",
        },
      ]}
    />
  );
}
