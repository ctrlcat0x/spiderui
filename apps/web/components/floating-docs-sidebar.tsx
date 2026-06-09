"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronsDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { docsConfig } from "@/config/docs"
import { components, isNewComponent } from "@/registry"
import { useClickSound } from "@/hooks/use-click-sound"
import { playSound } from "@/lib/sound-engine"
import { impactGenericLight002Sound } from "@/lib/impact-generic-light-002"
import { clickSoftSound } from "@/lib/click-soft"
import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade"
import { useDocsSidebar } from "@/components/docs-sidebar-context"

type NavViewMode = "grouped" | "collection"

const HOVER_SOUND_MS = 70
const TOGGLE_IN_SIDEBAR_DELAY_MS = 50
const DIAL_SCROLL_STEP_PX = 7
const MAIN_LINE_WIDTH = 18
const ACCENT_LINE_WIDTH = 30
const MAIN_LINE_SCALE = MAIN_LINE_WIDTH / ACCENT_LINE_WIDTH
const NAV_SPRING = { type: "spring" as const, stiffness: 520, damping: 19, mass: 0.45 }
const NAV_COLOR_TRANSITION = "color 220ms ease-out"

/** Static micro line at top — no hover interaction */
function MicroRulerLine({ width }: { width: number }) {
    return (
        <span
            className="pointer-events-none absolute left-0 top-0 h-px bg-foreground/30"
            style={{ width }}
        />
    )
}

function SectionHeader({ title, count }: { title: string; count: number }) {
    return (
        <span className="flex items-baseline gap-2 px-0 py-4 text-base font-medium text-foreground/35">
            {title}
            <span className="text-xs font-normal tabular-nums text-foreground/25">
                {count}
            </span>
        </span>
    )
}

function SidebarToggleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M184,40H72A32,32,0,0,0,40,72V184A32,32,0,0,0,72,216H184A32,32,0,0,0,216,184V72A32,32,0,0,0,184,40ZM56,72A16,16,0,0,1,72,56H128V200H72A16,16,0,0,1,56,184Z" />
        </svg>
    )
}

function SidebarToggleButton({
    onClick,
    className,
    isOpen,
}: {
    onClick: () => void
    className?: string
    isOpen: boolean
}) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={onClick}
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                isOpen && "text-zinc-900 dark:text-zinc-100",
                className
            )}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
        >
            <SidebarToggleIcon />
        </motion.button>
    )
}

function NavItemRow({
    item,
    isActive,
    isHovered,
    onNavigate,
    onHoverEnter,
    onHoverMove,
}: {
    item: { title: string; href: string }
    isActive: boolean
    isHovered: boolean
    onNavigate: () => void
    onHoverEnter: (event: React.MouseEvent<HTMLAnchorElement>) => void
    onHoverMove: (event: React.MouseEvent<HTMLAnchorElement>) => void
}) {
    const emphasized = isActive || isHovered
    const slug = item.href.split("/").pop()
    const comp = slug ? components[slug] : undefined
    const isNew = comp ? isNewComponent(comp) : false

    return (
        <div className="relative">
            {/* 1 & 2 — static micro / companion lines (no hover) */}
            <MicroRulerLine width={16} />
            <span className="pointer-events-none absolute left-0 top-1/4 h-px w-[13px] bg-foreground/30" />
            <span className="pointer-events-none absolute left-0 top-3/4 h-px w-[13px] bg-foreground/30" />

            {/* Main line — grows 18px → 30px from origin-left with spring overshoot */}
            <motion.span
                aria-hidden
                className={cn(
                    "pointer-events-none absolute left-0 top-1/2 z-40 w-[30px] rounded-full",
                    isActive && emphasized
                        ? "bg-[#e8470a]"
                        : emphasized
                          ? "bg-foreground/55"
                          : "bg-foreground/50"
                )}
                initial={false}
                animate={{
                    scaleX: emphasized ? 1 : MAIN_LINE_SCALE,
                    height: emphasized ? 1.8 : 1,
                    y: "-50%",
                }}
                style={{ transformOrigin: "left center" }}
                transition={NAV_SPRING}
            />

            <Link
                href={item.href}
                onMouseEnter={onHoverEnter}
                onMouseMove={onHoverMove}
                onClick={onNavigate}
                className="group/nav-item relative block pl-8 pr-3 py-0.5 select-none"
                aria-current={isActive ? "page" : undefined}
            >
                <motion.span
                    className="flex items-center gap-2"
                    initial={false}
                    animate={{
                        x: emphasized ? 8 : 0,
                        opacity: emphasized ? 1 : 0.45,
                    }}
                    style={{ transformOrigin: "left center" }}
                    transition={NAV_SPRING}
                >
                    <span
                        className={cn(
                            "truncate text-base",
                            emphasized ? "text-[#e8470a]" : "text-foreground/55"
                        )}
                        style={{ transition: NAV_COLOR_TRANSITION }}
                    >
                        {item.title}
                    </span>
                    {isNew && (
                        <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                            NEW
                        </span>
                    )}
                </motion.span>
            </Link>
        </div>
    )
}

function NavItemList({
    items,
    pathname,
    onNavigate,
    onHoverEnter,
    onHoverMove,
    onHoverLeave,
}: {
    items: { title: string; href: string }[]
    pathname: string
    onNavigate: () => void
    onHoverEnter: (item: { title: string; href: string }, event: React.MouseEvent<HTMLAnchorElement>) => void
    onHoverMove: (event: React.MouseEvent<HTMLAnchorElement>) => void
    onHoverLeave: () => void
}) {
    const [hoveredHref, setHoveredHref] = React.useState<string | null>(null)

    return (
        <div
            className="flex flex-col gap-0"
            onMouseLeave={() => {
                setHoveredHref(null)
                onHoverLeave()
            }}
        >
            {items.map((item) => (
                <NavItemRow
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    isHovered={hoveredHref === item.href}
                    onNavigate={onNavigate}
                    onHoverEnter={(event) => {
                        setHoveredHref(item.href)
                        onHoverEnter(item, event)
                    }}
                    onHoverMove={onHoverMove}
                />
            ))}
        </div>
    )
}

export function FloatingDocsSidebar() {
    const pathname = usePathname()
    const playClick = useClickSound()
    const { isOpen, setIsOpen } = useDocsSidebar()
    const [toggleInSidebar, setToggleInSidebar] = React.useState(false)
    const [viewMode, setViewMode] = React.useState<NavViewMode>("grouped")
    const [isHoverImageReady, setIsHoverImageReady] = React.useState(false)
    const [hoverPreview, setHoverPreview] = React.useState<{
        title: string
        imageSrc: string
    } | null>(null)
    const [hoverPosition, setHoverPosition] = React.useState<{ x: number; y: number } | null>(null)
    const scrollPlaybackRef = React.useRef<{ stop: () => void } | null>(null)
    const scrollSoundTimerRef = React.useRef<number | null>(null)
    const toggleMorphTimerRef = React.useRef<number | null>(null)
    const sidebarPanelRef = React.useRef<HTMLDivElement>(null)
    const navScrollContainerRef = React.useRef<HTMLDivElement>(null)
    const navScrollStepRef = React.useRef<number>(0)
    const lastDialTickStepRef = React.useRef<number>(0)

    const playDialTick = React.useCallback(() => {
        void playSound(clickSoftSound.dataUri, { volume: 0.11, playbackRate: 1.85 })
    }, [])

    const handleNavScroll = React.useCallback(() => {
        const container = navScrollContainerRef.current
        if (!container) return

        const nextStep = Math.round(container.scrollTop / DIAL_SCROLL_STEP_PX)
        if (nextStep === navScrollStepRef.current) return

        navScrollStepRef.current = nextStep

        // Tick every ~14px — aligns with passing pairs of ruler marks
        if (Math.abs(nextStep - lastDialTickStepRef.current) >= 2) {
            lastDialTickStepRef.current = nextStep
            playDialTick()
        }
    }, [playDialTick])

    const gettingStartedGroup = docsConfig.nav[0]
    const componentGroups = docsConfig.nav.slice(1)
    const collectionItems = docsConfig.flatComponentNav

    const getPreviewPosition = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            const cardWidth = 224
            const cardHeight = 170
            const offset = 18
            const maxX = Math.max(16, window.innerWidth - cardWidth - 16)
            const maxY = Math.max(16, window.innerHeight - cardHeight - 16)
            const x = Math.max(16, Math.min(event.clientX + offset, maxX))
            const y = Math.max(16, Math.min(event.clientY + offset, maxY))
            return { x, y }
        },
        []
    )

    const stopScrollSound = React.useCallback(() => {
        if (scrollSoundTimerRef.current !== null) {
            window.clearTimeout(scrollSoundTimerRef.current)
            scrollSoundTimerRef.current = null
        }
        scrollPlaybackRef.current?.stop()
        scrollPlaybackRef.current = null
    }, [])

    const startScrollSound = React.useCallback(() => {
        stopScrollSound()
        void playSound(impactGenericLight002Sound.dataUri, { volume: 0.075, playbackRate: 2.0 }).then((playback) => {
            scrollPlaybackRef.current = playback
            scrollSoundTimerRef.current = window.setTimeout(() => {
                playback.stop()
                if (scrollPlaybackRef.current === playback) {
                    scrollPlaybackRef.current = null
                }
                scrollSoundTimerRef.current = null
            }, HOVER_SOUND_MS)
        })
    }, [stopScrollSound])

    const updateHoverPreview = React.useCallback(
        (
            item: { title: string; href: string },
            event: React.MouseEvent<HTMLAnchorElement>
        ) => {
            const slug = item.href.split("/").pop()
            if (!slug) {
                setHoverPreview(null)
                return
            }

            const previewImage = components[slug]?.previewImage
            if (!previewImage) {
                setHoverPreview(null)
                setHoverPosition(null)
                return
            }
            setHoverPosition(getPreviewPosition(event))

            setHoverPreview({
                title: item.title,
                imageSrc: previewImage,
            })
        },
        [getPreviewPosition]
    )

    const updateHoverPosition = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            setHoverPosition(getPreviewPosition(event))
        },
        [getPreviewPosition]
    )

    const handleNavHoverEnter = React.useCallback(
        (item: { title: string; href: string }, event: React.MouseEvent<HTMLAnchorElement>) => {
            startScrollSound()
            updateHoverPreview(item, event)
        },
        [startScrollSound, updateHoverPreview]
    )

    const handleNavHoverLeave = React.useCallback(() => {
        stopScrollSound()
        setHoverPreview(null)
        setHoverPosition(null)
    }, [stopScrollSound])

    const clearToggleMorphTimer = React.useCallback(() => {
        if (toggleMorphTimerRef.current !== null) {
            window.clearTimeout(toggleMorphTimerRef.current)
            toggleMorphTimerRef.current = null
        }
    }, [])

    const handleToggleOpen = () => {
        playClick()
        if (isOpen) {
            clearToggleMorphTimer()
            setToggleInSidebar(false)
            setIsOpen(false)
            return
        }

        setIsOpen(true)
        clearToggleMorphTimer()
        toggleMorphTimerRef.current = window.setTimeout(() => {
            setToggleInSidebar(true)
            toggleMorphTimerRef.current = null
        }, TOGGLE_IN_SIDEBAR_DELAY_MS)
    }

    const handleClose = React.useCallback(() => {
        playClick()
        setToggleInSidebar(false)
        setIsOpen(false)
    }, [playClick, setIsOpen])

    const handleViewModeToggle = () => {
        playClick()
        setViewMode((prev) => (prev === "grouped" ? "collection" : "grouped"))
    }

    const handleNavigate = () => {
        playClick()
        stopScrollSound()
        setHoverPreview(null)
        setHoverPosition(null)
        setToggleInSidebar(false)
        setIsOpen(false)
    }

    React.useEffect(() => {
        setToggleInSidebar(false)
        setIsOpen(false)
    }, [pathname, setIsOpen])

    React.useEffect(() => {
        if (!isOpen) {
            setToggleInSidebar(false)
            stopScrollSound()
            setHoverPreview(null)
            setHoverPosition(null)
            setIsHoverImageReady(false)
            navScrollStepRef.current = 0
            lastDialTickStepRef.current = 0
        }
    }, [isOpen, stopScrollSound])

    React.useEffect(() => {
        if (!hoverPreview) {
            setIsHoverImageReady(false)
            return
        }
        setIsHoverImageReady(false)
    }, [hoverPreview?.imageSrc])

    React.useEffect(() => () => {
        stopScrollSound()
        clearToggleMorphTimer()
    }, [stopScrollSound, clearToggleMorphTimer])

    React.useEffect(() => {
        if (!isOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            const panel = sidebarPanelRef.current
            if (!panel) return
            if (panel.contains(event.target as Node)) return
            handleClose()
        }

        document.addEventListener("pointerdown", handlePointerDown)
        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [isOpen, handleClose])

    const showHeaderToggle = !isOpen || !toggleInSidebar
    const showSidebarToggle = isOpen && toggleInSidebar

    return (
        <>
            <AnimatePresence mode="wait" initial={false}>
                {showHeaderToggle && (
                    <SidebarToggleButton key="header-toggle" onClick={handleToggleOpen} isOpen={false} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            key="sidebar-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30"
                            aria-hidden
                        />

                        <motion.div
                            initial={{ x: -320, opacity: 0, filter: "blur(10px)" }}
                            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ x: -60, opacity: 0, filter: "blur(5px)" }}
                            transition={{ type: "spring", stiffness: 350, damping: 35, mass: 0.8 }}
                            className="fixed top-4 bottom-4 left-6 z-50 w-72 flex flex-col"
                        >
                            <div
                                ref={sidebarPanelRef}
                                className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-zinc-200/60 bg-white p-2 shadow-2xl shadow-black/40 dark:border-zinc-800/60 dark:bg-[#121212]"
                            >
                                <div className="flex items-center pb-3">
                                    <AnimatePresence mode="wait" initial={false}>
                                        {showSidebarToggle ? (
                                            <SidebarToggleButton key="sidebar-toggle" onClick={handleToggleOpen} isOpen />
                                        ) : (
                                            <motion.div
                                                key="sidebar-toggle-spacer"
                                                initial={false}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="h-8 w-8 shrink-0"
                                                aria-hidden
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative min-h-0 flex-1">
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-[#121212] dark:via-[#121212]/70"
                                    />

                                    <ScrollEdgeFade position="top" variant="sidebar" />
                                    <ScrollEdgeFade position="bottom" variant="sidebar" />

                                    <nav
                                        ref={navScrollContainerRef}
                                        data-scroll-viewport
                                        onScroll={handleNavScroll}
                                        className="relative z-10 flex h-full flex-col gap-1 overflow-y-auto px-3 py-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                    >
                                        <button
                                            type="button"
                                            onClick={handleViewModeToggle}
                                            className="mb-2 inline-flex items-center gap-1.5 px-0 text-[15px] font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                                            aria-label={`Switch to ${viewMode === "grouped" ? "collection" : "grouped"} view`}
                                        >
                                            <span>{viewMode === "grouped" ? "Grouped" : "Collection"}</span>
                                            <ChevronsDown className="h-4 w-4 shrink-0 opacity-50" />
                                        </button>

                                        {gettingStartedGroup && (
                                            <div className="mb-2 flex flex-col gap-0">
                                                <SectionHeader
                                                    title={gettingStartedGroup.title}
                                                    count={gettingStartedGroup.items.length}
                                                />
                                                <NavItemList
                                                    items={gettingStartedGroup.items}
                                                    pathname={pathname}
                                                    onNavigate={handleNavigate}
                                                    onHoverEnter={handleNavHoverEnter}
                                                    onHoverMove={updateHoverPosition}
                                                    onHoverLeave={handleNavHoverLeave}
                                                />
                                            </div>
                                        )}

                                        {viewMode === "grouped" ? (
                                            componentGroups.map((group, index) => (
                                                <div key={index} className="mb-2 flex flex-col gap-0 last:mb-0">
                                                    <SectionHeader
                                                        title={group.title}
                                                        count={group.items.length}
                                                    />
                                                    <NavItemList
                                                        items={group.items}
                                                        pathname={pathname}
                                                        onNavigate={handleNavigate}
                                                        onHoverEnter={handleNavHoverEnter}
                                                        onHoverMove={updateHoverPosition}
                                                        onHoverLeave={handleNavHoverLeave}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="mb-2 flex flex-col gap-0 last:mb-0">
                                                <SectionHeader
                                                    title="Collection"
                                                    count={collectionItems.length}
                                                />
                                                <NavItemList
                                                    items={collectionItems}
                                                    pathname={pathname}
                                                    onNavigate={handleNavigate}
                                                    onHoverEnter={handleNavHoverEnter}
                                                    onHoverMove={updateHoverPosition}
                                                    onHoverLeave={handleNavHoverLeave}
                                                />
                                            </div>
                                        )}
                                    </nav>
                                </div>
                            </div>

                            <AnimatePresence>
                                {hoverPreview && hoverPosition && (
                                    <motion.div
                                        key={hoverPreview.imageSrc}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.08, ease: "easeOut" }}
                                        className="fixed z-[70] w-56 pointer-events-none"
                                        style={{
                                            left: hoverPosition.x,
                                            top: hoverPosition.y,
                                        }}
                                    >
                                        <div className="overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl">
                                            <div className="relative h-32 w-full bg-zinc-100 dark:bg-zinc-800/60">
                                                <Image
                                                    key={hoverPreview.imageSrc}
                                                    src={hoverPreview.imageSrc}
                                                    alt={hoverPreview.title}
                                                    fill
                                                    className={cn(
                                                        "object-cover transition-opacity duration-150",
                                                        isHoverImageReady ? "opacity-100" : "opacity-0"
                                                    )}
                                                    sizes="224px"
                                                    onLoad={() => setIsHoverImageReady(true)}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
