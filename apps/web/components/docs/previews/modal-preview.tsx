"use client";

import { useRef, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Modal,
  type ModalFooterAlignment,
  type ModalSize,
} from "@workspace/ui/components/modal";

export function ModalPreview({
  size = "md",
  showClose = true,
  footerAlignment = "right",
}: {
  size?: ModalSize;
  showClose?: boolean;
  footerAlignment?: ModalFooterAlignment;
}) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center px-6 py-14">
      <Button onClick={() => setOpen(true)}>Delete project</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        initialFocusRef={cancelRef}
        title="Delete atlas-edge?"
        description="This removes the project, its deployments and its domains. It cannot be undone."
        size={size}
        showClose={showClose}
        footerAlignment={footerAlignment}
        footer={
          <>
            <Button
              ref={cancelRef}
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        Four deployments and one custom domain are attached.
      </Modal>
    </div>
  );
}
