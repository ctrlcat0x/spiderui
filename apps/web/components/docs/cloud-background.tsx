import { DocsPageLayout } from "@/components/docs-page-layout";
import { CloudBackgroundPreview } from "@/components/docs/previews/cloud-background-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { CloudBackground } from "@/components/ui/cloud-background"`;

const usageCode = `export function Demo() {
  return (
    <div className="h-[420px] overflow-hidden rounded-3xl">
      <CloudBackground
        colorBottom="#87ceeb"
        colorMid="#f8f8f8"
        colorTop="#ffffff"
        speed={1}
      />
    </div>
  )
}`;

export async function CloudBackgroundDocs() {
  const sourceCode =
    (await readComponentSource("cloud-background")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Cloud Background"
      description="A soft, procedural cloud field with configurable sky colors, motion speed, and automatic off-screen pausing."
      preview={<CloudBackgroundPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="cloud-background"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/cloud-background.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      usageNote={
        <p className="text-sm leading-relaxed text-muted-foreground">
          Give the parent an explicit height. The canvas fills that container
          and pauses automatically when it leaves the viewport.
        </p>
      }
      props={[
        {
          name: "colorBottom",
          type: "string",
          default: '"#87ceeb"',
          description: "Base sky color beneath the cloud layers.",
        },
        {
          name: "colorMid",
          type: "string",
          default: '"#f8f8f8"',
          description: "Color used for the softer middle cloud band.",
        },
        {
          name: "colorTop",
          type: "string",
          default: '"#ffffff"',
          description: "Highlight color used for the brightest clouds.",
        },
        {
          name: "speed",
          type: "number",
          default: "1",
          description: "Multiplier for wind and cloud morphing speed.",
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
