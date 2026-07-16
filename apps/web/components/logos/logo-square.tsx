import type React from "react"
import { SpiderLogo } from "./spider-logo"

export function LogoSquare({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={`flex items-center justify-center bg-primary text-primary-foreground rounded-lg ${className ?? ""}`}
      {...props}
    >
      <SpiderLogo size={32} variant="transparent" decorative />
    </div>
  )
}
