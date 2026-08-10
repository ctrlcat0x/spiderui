import { DocsPageLayout } from "@/components/docs-page-layout";
import { WavesShaderBackgroundPreview } from "@/components/docs/previews/waves-shader-background-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { WavesShaderBackground } from "@/components/ui/waves-shader-background"`;

const usageCode = `export function Demo() {
  return (
    <div className="h-[420px] overflow-hidden rounded-3xl">
      <WavesShaderBackground
        colors={["#031c26", "#1b6ca8", "#5ad2f4", "#eaf9ff"]}
        speed={-0.727}
        intensity={0.54}
        grain={0.101}
      />
    </div>
  )
}`;

export async function WavesShaderBackgroundDocs() {
  const sourceCode =
    (await readComponentSource("waves-shader-background")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Waves Shader Background"
      description="A grainy procedural blue wave field with a configurable palette, flow, surface treatment, responsive rendering, and automatic animation pausing."
      preview={<WavesShaderBackgroundPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="waves-shader-background"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/waves-shader-background.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      usageNote={
        <p className="text-sm leading-relaxed text-muted-foreground">
          Give the component or its parent an explicit height. Reduced-motion,
          hidden-tab, and off-screen states automatically render without a
          continuous animation loop.
        </p>
      }
      props={[
        {
          name: "colors",
          type: "readonly [string, string, string, string]",
          default: '["#031c26", "#1b6ca8", "#5ad2f4", "#eaf9ff"]',
          description: "Four-stop palette from shadow to highlight.",
        },
        {
          name: "speed",
          type: "number",
          default: "-0.727",
          description: "Animation speed and direction multiplier.",
        },
        {
          name: "scale",
          type: "number",
          default: "2",
          description: "Zoom level of the procedural field.",
        },
        {
          name: "intensity",
          type: "number",
          default: "0.54",
          description: "Strength of the layered wave displacement.",
        },
        {
          name: "warp",
          type: "number",
          default: "0.042",
          description: "Organic domain-warp amount.",
        },
        {
          name: "detail",
          type: "number",
          default: "1.536",
          description: "Frequency of the warped noise field.",
        },
        {
          name: "contrast",
          type: "number",
          default: "1.158",
          description: "Output contrast multiplier.",
        },
        {
          name: "saturation",
          type: "number",
          default: "1",
          description: "Output color saturation.",
        },
        {
          name: "brightness",
          type: "number",
          default: "0",
          description: "Brightness offset applied after shading.",
        },
        {
          name: "vignette",
          type: "number",
          default: "0.21",
          description: "Darkening strength toward the canvas edges.",
        },
        {
          name: "grain",
          type: "number",
          default: "0.101",
          description: "Static film-grain intensity.",
        },
        {
          name: "blur",
          type: "number",
          default: "0.002",
          description: "Soft five-sample blur applied to the wave field.",
        },
        {
          name: "rotation",
          type: "number",
          default: "5.6549",
          description: "Field rotation in radians.",
        },
        {
          name: "offset",
          type: "readonly [number, number]",
          default: "[0.11, -0.19]",
          description: "Horizontal and vertical field translation.",
        },
        {
          name: "drift",
          type: "number",
          default: "0.116",
          description: "Slow orbital movement through the field.",
        },
        {
          name: "paused",
          type: "boolean",
          default: "false",
          description: "Renders a still frame without an animation loop.",
        },
        {
          name: "height",
          type: "string | number",
          default: '"100%"',
          description: "CSS height of the background container.",
        },
        {
          name: "children",
          type: "React.ReactNode",
          description: "Optional content rendered above the shader canvas.",
        },
      ]}
    />
  );
}
