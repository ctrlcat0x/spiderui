import { DocsPageLayout } from "@/components/docs-page-layout";
import { Carousel004Preview } from "@/components/docs/previews/carousel-004-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { Carousel004, type Carousel004Item } from "@/components/ui/carousel-004"`;

const usageCode = `const images: Carousel004Item[] = [
  { id: "poppy", src: "/flowers/poppy.jpg", alt: "Pink poppy" },
  { id: "orchid", src: "/flowers/orchid.jpg", alt: "Pink orchid" },
  { id: "leaf", src: "/flowers/leaf.jpg", alt: "Tropical leaf" },
]

export function Gallery() {
  return <Carousel004 items={images} loop className="mx-auto max-w-5xl" />
}`;

export async function Carousel004Docs() {
  const sourceCode =
    (await readComponentSource("carousel-004")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Carousel 004"
      description="A spring-driven image gallery with a large draggable stage, compact expanding thumbnails, arrow controls, autoplay, and complete keyboard support."
      preview={<Carousel004Preview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="carousel-004"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/carousel-004.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "Carousel004Item[]",
          description: "Images containing a stable id, source, and alt text.",
        },
        {
          name: "index",
          type: "number",
          description: "Controlled active image index.",
        },
        {
          name: "defaultIndex",
          type: "number",
          default: "0",
          description: "Initial index when used uncontrolled.",
        },
        {
          name: "onIndexChange",
          type: "(index: number) => void",
          description: "Called after the active image changes.",
        },
        {
          name: "loop",
          type: "boolean",
          default: "false",
          description: "Wraps arrow, drag, and autoplay navigation.",
        },
        {
          name: "autoPlay",
          type: "boolean",
          default: "false",
          description: "Advances automatically while interaction is idle.",
        },
        {
          name: "autoPlayInterval",
          type: "number",
          default: "4000",
          description: "Milliseconds between automatic changes.",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          default: "true",
          description: "Pauses autoplay while the carousel is hovered.",
        },
        {
          name: "aspectRatio",
          type: "string",
          default: '"16 / 9"',
          description: "CSS aspect ratio used by the main stage.",
        },
      ]}
    />
  );
}
