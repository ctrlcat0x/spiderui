"use client"

import { LogoCloud006 } from "@workspace/ui/components/logo-cloud-006"
import { DEFAULT_LOGO_CLOUD_006_ROWS } from "@/components/docs/previews/logo-cloud-006-logos"

export function LogoCloud006Preview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 sm:p-10">
      <LogoCloud006
        title={[
          "Worked with",
          "Top companies in the world who saw potential in us",
        ]}
        rows={DEFAULT_LOGO_CLOUD_006_ROWS.map((row) => [...row])}
        className="w-full"
      />
    </div>
  )
}
