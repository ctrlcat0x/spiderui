"use client"

import * as React from "react"

type DocsSidebarContextValue = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DocsSidebarContext = React.createContext<DocsSidebarContextValue | null>(null)

export function DocsSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DocsSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DocsSidebarContext.Provider>
  )
}

export function useDocsSidebar() {
  const context = React.useContext(DocsSidebarContext)
  const [localIsOpen, setLocalIsOpen] = React.useState(false)

  if (context) {
    return context
  }

  return { isOpen: localIsOpen, setIsOpen: setLocalIsOpen }
}
