import { DocsPageLayout } from "@/components/docs-page-layout";
import { ElasticSliderPreview } from "@/components/docs/previews/elastic-slider-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { ElasticSlider } from "@/components/ui/elastic-slider"`;

const usageCode = `export function NoiseControl() {
  const [noise, setNoise] = useState(0)

  return (
    <ElasticSlider
      label="Noise"
      value={noise}
      onValueChange={setNoise}
      min={0}
      max={100}
      step={1}
      formatValue={(value) => \`\${value}%\`}
    />
  )
}`;

const precisionCode = `<ElasticSlider
  label="Opacity"
  defaultValue={0.72}
  min={0}
  max={1}
  step={0.01}
  formatValue={(value) => value.toFixed(2)}
/>`;

export async function ElasticSliderDocs() {
  const sourceCode =
    (await readComponentSource("elastic-slider")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Elastic Slider"
      description="An inset control with embedded labels, contextual hash marks, a dodging handle, rubber edges, and precise pointer or keyboard input."
      preview={<ElasticSliderPreview />}
      previewCode={usageCode}
      installPackageName="elastic-slider"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/elastic-slider.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Decimal steps",
          preview: (
            <div className="flex h-full w-full items-center justify-center p-8">
              <div className="w-full max-w-md">
                <ElasticSliderPreview compact />
              </div>
            </div>
          ),
          code: precisionCode,
        },
      ]}
      props={[
        {
          name: "value",
          type: "number",
          description: "Controlled slider value.",
        },
        {
          name: "defaultValue",
          type: "number",
          description: "Initial uncontrolled value.",
        },
        {
          name: "onValueChange",
          type: "(value: number) => void",
          description:
            "Called when pointer or keyboard interaction changes the value.",
        },
        {
          name: "min",
          type: "number",
          default: "0",
          description: "Minimum value.",
        },
        {
          name: "max",
          type: "number",
          default: "1",
          description: "Maximum value.",
        },
        {
          name: "step",
          type: "number",
          default: "0.01",
          description: "Increment used for snapping and keyboard input.",
        },
        {
          name: "label",
          type: "string",
          description: "Visible and accessible slider label.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          default: "String",
          description: "Formats the visible value and accessible value text.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables pointer and keyboard interaction.",
        },
      ]}
    />
  );
}
