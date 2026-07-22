import { DocsPageLayout } from "@/components/docs-page-layout";
import { WheelTimePickerPreview } from "@/components/docs/previews/wheel-time-picker-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { WheelTimePicker } from "@/components/ui/wheel-time-picker"`;

const usageCode = `export function Demo() {
  return (
    <WheelTimePicker
      defaultValue={{ hour: 14, minute: 35, second: 20 }}
      hideSeconds
      onChange={(time) => console.log(time)}
    />
  )
}`;

export async function WheelTimePickerDocs() {
  const sourceCode =
    (await readComponentSource("wheel-time-picker")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Wheel Time Picker"
      description="An inertial hour, minute, second, and meridiem picker that resizes when optional columns are hidden."
      preview={<WheelTimePickerPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="wheel-time-picker"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/wheel-time-picker.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "value",
          type: "WheelTimeValue",
          description: "Controlled 24-hour time value.",
        },
        {
          name: "defaultValue",
          type: "WheelTimeValue",
          default: "{ hour: 9, minute: 30, second: 0 }",
          description: "Initial time for uncontrolled usage.",
        },
        {
          name: "onChange",
          type: "(value: WheelTimeValue) => void",
          description: "Called as a wheel crosses into a new value.",
        },
        {
          name: "hideMinutes",
          type: "boolean",
          default: "false",
          description: "Remove the minute column and shrink the picker.",
        },
        {
          name: "hideSeconds",
          type: "boolean",
          default: "false",
          description: "Remove the second column and shrink the picker.",
        },
        {
          name: "itemHeight",
          type: "number",
          default: "44",
          description: "Height of each wheel step in pixels.",
        },
        {
          name: "visibleCount",
          type: "3 | 5 | 7",
          default: "5",
          description: "Number of visible rows.",
        },
        {
          name: "lens",
          type: "boolean",
          default: "true",
          description: "Show the centered selection lens.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disable pointer, wheel, and keyboard input.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the picker frame.",
        },
      ]}
    />
  );
}
