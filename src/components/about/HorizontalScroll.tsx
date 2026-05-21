// components/about/HorizontalScroll.tsx
import { useEffect, useRef } from "react"
import type { RefObject } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface HorizontalScrollProps {
  children: React.ReactNode
  sectionCount: number
  containerRef?: RefObject<HTMLDivElement | null> // ← null-safe
}

const HorizontalScroll = ({ children, sectionCount, containerRef }: HorizontalScrollProps) => {
  const internalRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const outerRef = (containerRef ?? internalRef) as RefObject<HTMLDivElement | null>

  useEffect(() => {
    if (window.innerWidth < 768) return

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: () => -(window.innerWidth * (sectionCount - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: outerRef.current,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => `+=${window.innerWidth * (sectionCount - 1)}`,
        },
      })
    }, outerRef as RefObject<HTMLDivElement>)

    return () => ctx.revert()
  }, [sectionCount])

  return (
    <div ref={outerRef as RefObject<HTMLDivElement>} className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex"
        style={{ width: `${sectionCount * 100}vw` }}
      >
        {children}
      </div>
    </div>
  )
}

export default HorizontalScroll