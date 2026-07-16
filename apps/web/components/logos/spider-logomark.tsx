import type React from "react"
import type { SpiderLogoProps } from "./spider-logo"
import { SpiderLogo } from "./spider-logo"

/** @deprecated Use SpiderLogo instead */
export function SpiderUILogomark(props: SpiderLogoProps): React.JSX.Element {
  return <SpiderLogo decorative {...props} />
}
