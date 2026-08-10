import { DocsPageLayout } from "@/components/docs-page-layout";
import { DrawerPreview } from "@/components/docs/previews/drawer-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { Drawer } from "@/components/ui/drawer"`;

const usageCode = `export function EditProfile() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit profile</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Edit profile"
        description="Visible to everyone in the workspace"
        side="right"
        width={420}
        footerAlignment="right"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </>
        }
      >
        <div>Profile fields</div>
      </Drawer>
    </>
  )
}`;

export async function DrawerDocs() {
  const sourceCode =
    (await readComponentSource("drawer")) || "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Drawer"
      description="An accessible, draggable side panel with focus management, configurable edges, footer layouts, and an optional grab handle."
      preview={<DrawerPreview />}
      previewCode={usageCode}
      installPackageName="drawer"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/drawer.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Spread footer",
          preview: <DrawerPreview footerAlignment="spread" />,
          code: `<Drawer footerAlignment="spread" footer={<>...</>} />`,
        },
        {
          title: "Left with handle",
          preview: <DrawerPreview side="left" showHandle />,
          code: `<Drawer side="left" showHandle footerAlignment="left" />`,
        },
        {
          title: "Bottom with handle",
          preview: <DrawerPreview side="bottom" showHandle />,
          code: `<Drawer side="bottom" height={420} showHandle />`,
        },
      ]}
      props={[
        {
          name: "open",
          type: "boolean",
          description: "Controls drawer visibility.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Receives visibility changes.",
        },
        {
          name: "title",
          type: "ReactNode",
          description: "Required accessible drawer title.",
        },
        {
          name: "description",
          type: "ReactNode",
          description: "Optional accessible description.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Scrollable drawer content.",
        },
        {
          name: "footer",
          type: "ReactNode",
          description: "Persistent footer actions.",
        },
        {
          name: "footerAlignment",
          type: '"left" | "right" | "spread"',
          default: '"right"',
          description: "Aligns footer actions.",
        },
        {
          name: "side",
          type: '"left" | "right" | "top" | "bottom"',
          default: '"right"',
          description: "Sets opening edge.",
        },
        {
          name: "width",
          type: "number | string",
          default: "420",
          description: "Sets left and right panel width.",
        },
        {
          name: "height",
          type: "number | string",
          default: "420",
          description: "Sets top and bottom panel height.",
        },
        {
          name: "showHandle",
          type: "boolean",
          default: "false",
          description: "Shows draggable dismiss handle.",
        },
        {
          name: "showClose",
          type: "boolean",
          default: "true",
          description: "Shows header close control.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          description: "Allows Escape dismissal.",
        },
        {
          name: "closeOnBackdrop",
          type: "boolean",
          default: "true",
          description: "Allows backdrop dismissal.",
        },
        {
          name: "lockScroll",
          type: "boolean",
          default: "true",
          description: "Locks page scrolling while open.",
        },
        {
          name: "dismissThreshold",
          type: "number",
          default: "0.32",
          description: "Drag distance ratio required to dismiss.",
        },
        {
          name: "inwardPull",
          type: "number",
          default: "0.08",
          description: "Adds restrained elastic travel toward the page.",
        },
      ]}
    />
  );
}
