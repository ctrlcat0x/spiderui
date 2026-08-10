import { DocsPageLayout } from "@/components/docs-page-layout";
import { DiscreteTabsPreview } from "@/components/docs/previews/discrete-tabs-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { DiscreteTabs } from "@/components/ui/discrete-tabs"`;

const usageCode = `const items = [
  { value: "inbox", label: "Inbox", icon: Mail, content: <p>Inbox messages</p> },
  { value: "planner", label: "Planner", icon: CalendarDays, content: <p>Upcoming events</p> },
  { value: "alerts", label: "Alerts", icon: Bell, content: <p>Recent alerts</p> },
]

export function NavigationTabs() {
  return <DiscreteTabs items={items} defaultValue="alerts" />
}`;

export async function DiscreteTabsDocs() {
  const sourceCode =
    (await readComponentSource("discrete-tabs")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Discrete Tabs"
      description="Accessible icon tabs that expand the active label with spring layout and blur-fade motion."
      preview={<DiscreteTabsPreview />}
      previewCode={usageCode}
      installPackageName="discrete-tabs"
      installDependencies="radix-ui motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/discrete-tabs.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "readonly DiscreteTabItem[]",
          description:
            "Tab values, labels, icons, optional panels, and states.",
        },
        {
          name: "value",
          type: "string",
          description: "Controlled active tab value.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial value for uncontrolled tabs.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called whenever the selected tab changes.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Controls tab height, icon scale, and spacing.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Sets layout and arrow-key direction.",
        },
        {
          name: "listLabel",
          type: "string",
          default: '"Sections"',
          description: "Accessible name for the tab list.",
        },
        {
          name: "listClassName",
          type: "string",
          description: "Classes applied to the tab list.",
        },
        {
          name: "triggerClassName",
          type: "string",
          description: "Classes applied to every tab trigger.",
        },
        {
          name: "contentClassName",
          type: "string",
          description: "Classes applied to every rendered tab panel.",
        },
      ]}
    />
  );
}
