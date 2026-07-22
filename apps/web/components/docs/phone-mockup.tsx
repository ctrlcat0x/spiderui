import { DocsPageLayout } from "@/components/docs-page-layout";
import { PhoneMockupPreview } from "@/components/docs/previews/phone-mockup-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { PhoneCarousel, PhoneMockup } from "@/components/ui/phone-mockup"`;

const usageCode = `const screens = [
  { src: "/screens/home.png", alt: "Home screen" },
  { src: "/screens/music.png", alt: "Music player" },
  { src: "/screens/weather.png", alt: "Weather screen" },
]

export function Demo() {
  return (
    <PhoneCarousel
      items={screens}
      interval={3500}
      className="max-w-3xl"
    />
  )
}`;

export async function PhoneMockupDocs() {
  const sourceCode =
    (await readComponentSource("phone-mockup")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Phone Mockup"
      description="A precise iPhone-style device frame with custom screen content, image support, and an optional autoplay carousel or stacked showcase."
      preview={<PhoneMockupPreview />}
      previewCode={usageCode}
      installPackageName="phone-mockup"
      installDependencies="motion lucide-react clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/phone-mockup.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "src",
          type: "string",
          description: "Optional image rendered inside the phone screen.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Custom screen UI used when src is not provided.",
        },
        {
          name: "alt",
          type: "string",
          default: '"Phone screen"',
          description: "Accessible description for the screen image.",
        },
        {
          name: "width",
          type: "string | number",
          default: '"100%"',
          description: "Width of the phone frame.",
        },
        {
          name: "items",
          type: "readonly PhoneCarouselItem[]",
          description: "Screens displayed by PhoneCarousel.",
        },
        {
          name: "variant",
          type: '"carousel" | "stack"',
          default: '"carousel"',
          description: "Side-by-side carousel or layered phone stack.",
        },
        {
          name: "activeIndex",
          type: "number",
          description: "Controlled active screen index.",
        },
        {
          name: "defaultActiveIndex",
          type: "number",
          default: "0",
          description: "Initial index for an uncontrolled carousel.",
        },
        {
          name: "autoPlay",
          type: "boolean",
          default: "true",
          description: "Advance screens automatically.",
        },
        {
          name: "interval",
          type: "number",
          default: "3000",
          description: "Milliseconds between automatic transitions.",
        },
        {
          name: "showControls",
          type: "boolean",
          default: "true",
          description: "Show previous, pause, and next controls.",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          default: "true",
          description: "Pause autoplay while the pointer is over the showcase.",
        },
        {
          name: "onActiveIndexChange",
          type: "(index: number) => void",
          description: "Called whenever navigation requests a new screen.",
        },
      ]}
    />
  );
}
