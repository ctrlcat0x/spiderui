import { DocsPageLayout } from "@/components/docs-page-layout";
import { MarqueeAlongPathPreview } from "@/components/docs/previews/marquee-along-path-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { MarqueeAlongPath } from "@/components/ui/marquee-along-path"`;

const usageCode = `const tiles = ["Aa", "&", "g", "0123", "S", "R"]

export function TypographyLoop() {
  return (
    <MarqueeAlongPath
      path="M -35 245 C 145 345 245 240 300 105 C 345 -10 470 45 435 155 C 395 280 570 300 795 195"
      viewBox="0 0 760 360"
      speed={7}
      repeat={3}
      draggable
      pauseOnHover
      className="h-[460px] w-full"
    >
      {tiles.map((tile) => (
        <div key={tile} className="grid size-24 place-items-center border bg-card text-3xl">
          {tile}
        </div>
      ))}
    </MarqueeAlongPath>
  )
}`;

export async function MarqueeAlongPathDocs() {
  const sourceCode =
    (await readComponentSource("marquee-along-path")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Marquee Along Path"
      description="A responsive marquee that carries any React content around an SVG path with hover pause, drag momentum, rolling depth, and reduced-motion support."
      preview={<MarqueeAlongPathPreview />}
      previewCode={usageCode}
      installPackageName="marquee-along-path"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/marquee-along-path.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "children",
          type: "React.ReactNode",
          description: "Items distributed evenly around the path.",
        },
        {
          name: "path",
          type: "string",
          description: "SVG path data used by both the guide and moving items.",
        },
        {
          name: "viewBox",
          type: "string",
          default: '"0 0 100 100"',
          description: "Coordinate system containing the path.",
        },
        {
          name: "speed",
          type: "number",
          default: "8",
          description: "Path progress advanced per second.",
        },
        {
          name: "direction",
          type: '"normal" | "reverse"',
          default: '"normal"',
          description: "Travel direction along the path.",
        },
        {
          name: "repeat",
          type: "number",
          default: "3",
          description:
            "Number of repeated child sets distributed around the path.",
        },
        {
          name: "showPath",
          type: "boolean",
          default: "false",
          description: "Displays the SVG guide path.",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          default: "false",
          description: "Stops automatic travel while hovered.",
        },
        {
          name: "hoverSpeedFactor",
          type: "number",
          default: "0.2",
          description:
            "Speed multiplier while hovered when pauseOnHover is false.",
        },
        {
          name: "draggable",
          type: "boolean",
          default: "false",
          description: "Enables pointer scrubbing with momentum.",
        },
        {
          name: "dragSensitivity",
          type: "number",
          default: "0.12",
          description: "Path progress applied per horizontal pointer pixel.",
        },
        {
          name: "rotate",
          type: "boolean",
          default: "true",
          description: "Rotates items to follow the path tangent.",
        },
        {
          name: "rollingZIndex",
          type: "boolean",
          default: "true",
          description: "Varies stacking order as items travel around the path.",
        },
      ]}
    />
  );
}
