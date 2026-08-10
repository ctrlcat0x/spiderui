import { DocsPageLayout } from "@/components/docs-page-layout";
import { ModalPreview } from "@/components/docs/previews/modal-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { Modal } from "@/components/ui/modal"`;

const usageCode = `export function DeleteProject() {
  const [open, setOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete project</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        initialFocusRef={cancelRef}
        title="Delete atlas-edge?"
        description="This removes the project and cannot be undone."
        size="md"
        footerAlignment="right"
        footer={
          <>
            <Button ref={cancelRef} variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </>
        }
      >
        Four deployments and one custom domain are attached.
      </Modal>
    </>
  )
}`;

const splitCode = `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Publish changes?"
  footerAlignment="split"
  footer={
    <>
      <Button variant="ghost">Discard</Button>
      <Button>Publish</Button>
    </>
  }
/>`;

const largeCode = `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Project settings"
  size="lg"
  showClose={false}
/>`;

export async function ModalDocs() {
  const sourceCode =
    (await readComponentSource("modal")) || "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Modal"
      description="An accessible modal with focus trapping, focus restoration, nested Escape handling, scroll locking, responsive sizes, optional close control, and flexible footer alignment."
      preview={<ModalPreview />}
      previewCode={usageCode}
      installPackageName="modal"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/modal.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Split footer",
          preview: <ModalPreview footerAlignment="split" />,
          code: splitCode,
        },
        {
          title: "Large without close icon",
          preview: <ModalPreview size="lg" showClose={false} />,
          code: largeCode,
        },
      ]}
      props={[
        {
          name: "open",
          type: "boolean",
          description: "Controls modal visibility.",
        },
        {
          name: "onClose",
          type: "() => void",
          description: "Called by Escape, backdrop, and close-button actions.",
        },
        {
          name: "title",
          type: "ReactNode",
          description: "Required accessible modal title.",
        },
        {
          name: "description",
          type: "ReactNode",
          description: "Optional description linked to the dialog.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Scrollable modal body content.",
        },
        { name: "footer", type: "ReactNode", description: "Footer actions." },
        {
          name: "footerAlignment",
          type: '"right" | "split"',
          default: '"right"',
          description:
            "Aligns all actions right or separates first and last actions.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Sets modal maximum width.",
        },
        {
          name: "showClose",
          type: "boolean",
          default: "true",
          description: "Shows or hides the top close button.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          description: "Allows Escape to close the topmost modal.",
        },
        {
          name: "closeOnBackdrop",
          type: "boolean",
          default: "true",
          description:
            "Allows pointer clicks that start and end outside to close.",
        },
        {
          name: "lockScroll",
          type: "boolean",
          default: "true",
          description: "Locks document scrolling while open.",
        },
        {
          name: "initialFocusRef",
          type: "RefObject<HTMLElement>",
          description: "Element focused when the modal opens.",
        },
        {
          name: "maxHeight",
          type: "string",
          default: '"min(78vh, 620px)"',
          description: "Overrides the modal maximum height.",
        },
      ]}
    />
  );
}
