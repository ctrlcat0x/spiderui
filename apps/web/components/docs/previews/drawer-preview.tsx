"use client";

import { useRef, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  type DrawerFooterAlignment,
  type DrawerSide,
} from "@workspace/ui/components/drawer";

export function DrawerPreview({
  side = "right",
  footerAlignment = "right",
  showHandle = false,
}: {
  side?: DrawerSide;
  footerAlignment?: DrawerFooterAlignment;
  showHandle?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex min-h-[520px] w-full items-center justify-center px-6 py-14">
      <Button onClick={() => setOpen(true)}>Edit profile</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        width={420}
        height={420}
        showHandle={showHandle}
        initialFocusRef={cancelRef}
        title="Edit profile"
        description="Visible to everyone in the workspace"
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
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Display name
            <input
              defaultValue="Mira Sandoval"
              className="h-10 rounded-lg border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              type="email"
              defaultValue="mira@studio.co"
              className="h-10 rounded-lg border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <p className="text-sm leading-6 text-muted-foreground">
            Profile changes sync across every project in this workspace.
          </p>
        </div>
      </Drawer>
    </div>
  );
}
