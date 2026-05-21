// hooks/useHeadingSwap.ts
// ─────────────────────────────────────────────────────────────────────────────
// Animates section headings as the horizontal track slides:
//   - Current heading slides UP and fades out
//   - Next heading slides UP from below and fades in
//   - Reverses on scroll back
//
// Usage: call this hook AFTER HorizontalScroll mounts,
// pass the same containerRef you gave HorizontalScroll.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from "react"
import type { RefObject } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface UseHeadingSwapOptions {
  containerRef: RefObject<HTMLDivElement | null>
  headingRefs: RefObject<HTMLHeadingElement | null>[]
}

export function useHeadingSwap({ containerRef, headingRefs }: UseHeadingSwapOptions) {
  useEffect(() => {
    if (window.innerWidth < 768) return
    if (!containerRef.current) return

    const headings = headingRefs.map(r => r.current).filter(Boolean) as HTMLHeadingElement[]
    if (headings.length === 0) return

    // ── set initial state: first heading visible, rest hidden below ──
    gsap.set(headings[0], { y: 0, opacity: 1 })
    headings.slice(1).forEach(h => gsap.set(h, { y: 60, opacity: 0 }))

    const sectionCount = headingRefs.length
    const totalScroll = window.innerWidth * (sectionCount - 1)

    // ── one ScrollTrigger that watches the entire horizontal pin ──
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${totalScroll}`,
      scrub: 1,
      onUpdate: (self) => {
        const rawProgress = self.progress * (sectionCount - 1)  // 0 → sectionCount-1

        headings.forEach((heading, i) => {
          // distance from the current "active" index
          const dist = rawProgress - i

          if (dist < -0.5) {
            // section is ahead — waiting below
            gsap.set(heading, { y: 60, opacity: 0 })
          } else if (dist >= -0.5 && dist < 0) {
            // entering — slides up from below
            const p = (dist + 0.5) / 0.5   // 0 → 1
            gsap.set(heading, { y: 60 - 60 * p, opacity: p })
          } else if (dist >= 0 && dist < 0.5) {
            // fully active
            gsap.set(heading, { y: 0, opacity: 1 })
          } else if (dist >= 0.5 && dist < 1) {
            // leaving — slides up and out
            const p = (dist - 0.5) / 0.5   // 0 → 1
            gsap.set(heading, { y: -60 * p, opacity: 1 - p })
          } else {
            // fully passed — hidden above
            gsap.set(heading, { y: -60, opacity: 0 })
          }
        })
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [containerRef, headingRefs])
}