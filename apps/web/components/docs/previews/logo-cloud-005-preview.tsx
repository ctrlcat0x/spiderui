"use client"

import { LogoCloud005 } from "@workspace/ui/components/logo-cloud-005"
import { DEFAULT_LOGO_CLOUD_005_ROWS } from "@/components/docs/previews/logo-cloud-005-logos"

export function LogoCloud005Preview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 sm:p-10">
      <LogoCloud005
        title={["Trusted by experts", "on the web."]}
        rows={DEFAULT_LOGO_CLOUD_005_ROWS.map((row) => [...row])}
        className="w-full"
      />
    </div>
  )
}
