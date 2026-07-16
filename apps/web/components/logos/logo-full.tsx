import type React from "react"
import { SpiderLogo } from "./spider-logo"

export function LogoFull({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`} {...props}>
      <SpiderLogo size={24} decorative />
      <span className="font-bold text-lg tracking-tight">Spider UI</span>
    </div>
  )
}
