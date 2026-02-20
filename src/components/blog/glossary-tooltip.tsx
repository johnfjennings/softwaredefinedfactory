"use client"

import { useState, useRef, useCallback, useId } from "react"
import Link from "next/link"

interface GlossaryTooltipProps {
  term: string
  definition: string
  children: React.ReactNode
}

export function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = useId()

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(true)
  }, [])

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 150)
  }, [])

  const letter = term[0].toUpperCase()

  return (
    <span
      className="relative inline"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span
        className="border-b border-dotted border-muted-foreground/40 cursor-help"
        tabIndex={0}
        role="term"
        aria-describedby={tooltipId}
      >
        {children}
      </span>
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-72 rounded-lg border bg-popover p-3 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <span className="block font-semibold text-foreground mb-1">{term}</span>
          <span className="block text-muted-foreground text-xs leading-relaxed mb-2">
            {definition}
          </span>
          <Link
            href={`/glossary#${letter}`}
            className="text-xs text-primary hover:underline"
          >
            View in glossary &rarr;
          </Link>
          {/* Arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-border" />
        </span>
      )}
    </span>
  )
}
