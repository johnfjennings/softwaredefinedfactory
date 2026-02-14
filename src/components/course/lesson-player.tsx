"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"

interface LessonPlayerProps {
  contentPath: string
  title: string
  type: "article" | "slides" | "video"
}

export function LessonPlayer({ contentPath, title, type }: LessonPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div ref={containerRef} className="relative bg-background rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <h2 className="font-medium text-sm truncate">{title}</h2>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <iframe
        src={contentPath}
        title={title}
        className="w-full border-0"
        style={{ height: isFullscreen ? "calc(100vh - 44px)" : "70vh" }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}
