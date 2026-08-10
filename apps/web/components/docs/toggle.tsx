import { DocsPageLayout } from "@/components/docs-page-layout";
import {
  TogglePersonalizePanel,
  TogglePreview,
} from "@/components/docs/previews/toggle-preview";
import { readComponentSource } from "@/lib/source-code";
import { Toggle } from "@workspace/ui/components/toggle";

const importCode = `import { Toggle } from "@/components/ui/toggle"`;

const usageCode = `export function NotificationsToggle() {
  const [enabled, setEnabled] = useState(true)

  return (
    <Toggle
      checked={enabled}
      onCheckedChange={setEnabled}
      accentColor="#10b981"
      aria-label="Enable notifications"
    />
  )
}`;

const sizesCode = `<div className="flex items-center gap-4">
  <Toggle size="sm" aria-label="Small toggle" />
  <Toggle size="default" defaultChecked aria-label="Default toggle" />
  <Toggle size="lg" aria-label="Large toggle" />
</div>`;

export async function ToggleDocs() {
  const sourceCode =
    (await readComponentSource("toggle")) || "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Toggle"
      description="A compact on/off switch with accent-state color and an elastic spring thumb."
      preview={<TogglePreview />}
      personalizeContent={<TogglePersonalizePanel />}
      previewCode={usageCode}
      installPackageName="toggle"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/toggle.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Sizes",
          preview: (
            <div className="flex h-full min-h-72 w-full items-center justify-center p-8">
              <div className="flex items-center gap-5">
                <Toggle size="sm" aria-label="Small toggle" />
                <Toggle defaultChecked aria-label="Default toggle" />
                <Toggle size="lg" aria-label="Large toggle" />
              </div>
            </div>
          ),
          code: sizesCode,
        },
        {
          title: "Disabled",
          preview: <TogglePreview disabled />,
          code: `<Toggle disabled defaultChecked aria-label="Notifications unavailable" />`,
        },
      ]}
      props={[
        {
          name: "checked",
          type: "boolean",
          description: "Controlled on/off state.",
        },
        {
          name: "defaultChecked",
          type: "boolean",
          default: "false",
          description: "Initial state when uncontrolled.",
        },
        {
          name: "onCheckedChange",
          type: "(checked: boolean) => void",
          description: "Called when the state changes.",
        },
        {
          name: "accentColor",
          type: "React.CSSProperties['backgroundColor']",
          default: '"var(--primary)"',
          description:
            "CSS color used for the active track, including hex, rgb, hsl, oklch, or CSS variables.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Track and thumb size.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents interaction and dims the control.",
        },
      ]}
    />
  );
}
