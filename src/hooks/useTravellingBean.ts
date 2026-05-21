// hooks/useTravellingBean.ts
import { useEffect } from "react"
import type { RefObject } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface UseTravellingBeanOptions {
    beanRef: RefObject<HTMLImageElement | null>
    hScrollContainerRef: RefObject<HTMLDivElement | null>
    beanCenterRef: RefObject<HTMLDivElement | null>
}

export function useTravellingBean({
    beanRef,
    hScrollContainerRef,
    beanCenterRef,
}: UseTravellingBeanOptions) {
    useEffect(() => {
        const bean = beanRef.current
        if (!bean) return

        const ctx = gsap.context(() => {

            // ── PHASE 1: hero state ────────────────────────────────────────────────
            gsap.set(bean, {
                position: "fixed",
                right: "0%",
                bottom: "0%",
                left: "auto",
                top: "auto",
                xPercent: 0,
                yPercent: 0,
                width: "clamp(140px, 14vw, 220px)",
                filter: "blur(6px)",
                opacity: 0.75,
                zIndex: 40,
                transformOrigin: "center center",
            })

            // ── PHASE 1→2: hero scrolls out, bean drifts up ────────────────────────
            ScrollTrigger.create({
                trigger: "body",
                start: "top top",
                end: () => `+=${window.innerHeight * 0.8}`,
                scrub: 1.2,
                onUpdate: (self) => {
                    const p = self.progress
                    gsap.set(bean, {
                        filter: `blur(${6 - p * 6}px)`,
                        opacity: 0.75 + p * 0.25,
                        bottom: `${p * 60}%`,
                        right: `${2 + p * 3}%`,
                    })
                },
            })

            // ── PHASE 2: horizontal scroll pin period ──────────────────────────────
            if (hScrollContainerRef.current) {
                ScrollTrigger.create({
                    trigger: hScrollContainerRef.current,
                    start: "top top",
                    end: "bottom top",
                    onEnter: () => {
                        gsap.to(bean, {
                            bottom: "auto",
                            top: "12%",
                            right: "3%",
                            filter: "blur(0px)",
                            opacity: 1,
                            width: "clamp(100px, 10vw, 160px)",
                            duration: 0.5,
                            ease: "power2.out",
                        })
                    },
                    onLeaveBack: () => {
                        gsap.to(bean, {
                            top: "auto",
                            bottom: "0%",
                            right: "0%",
                            filter: "blur(6px)",
                            opacity: 0.75,
                            width: "clamp(140px, 14vw, 220px)",
                            duration: 0.4,
                        })
                    },
                })
            }

            // ── PHASE 3: commitment section, bean travels to center bean ────────────
            if (beanCenterRef.current) {

                const getCenterBeanW = () => {
                    const vw = window.innerWidth
                    if (vw >= 1536) return vw * 0.40
                    if (vw >= 640) return vw * 0.36
                    return vw * 0.45
                }

                const getStartW = () => Math.min(Math.max(window.innerWidth * 0.10, 100), 160)

                // helper — snaps bean to the exact center position at full size
                const lockAtCenter = () => {
                    const target = beanCenterRef.current
                    if (!target) return
                    const rect = target.getBoundingClientRect()
                    const endW = getCenterBeanW()
                    const targetCX = rect.left + rect.width / 2
                    const targetCY = rect.top + rect.height / 2
                    const vw = window.innerWidth
                    const fixedRight = ((vw - targetCX - endW / 2) / vw) * 100
                    const fixedTop = ((targetCY - endW / 2) / window.innerHeight) * 100
                    gsap.set(bean, {
                        top: `${fixedTop}%`,
                        right: `${fixedRight}%`,
                        width: `${endW}px`,
                        opacity: 1,
                        filter: "blur(0px)",
                    })
                }

                ScrollTrigger.create({
                    trigger: beanCenterRef.current,
                    start: "top 80%",
                    end: "bottom bottom",   // ← extends to when the section bottom hits viewport bottom
                    scrub: 1.5,
                    onUpdate: (self) => {
                        const p = self.progress
                        const target = beanCenterRef.current
                        if (!target) return

                        // travel phase: 0 → 0.6 — bean moves toward center
                        // lock phase:   0.6 → 1 — bean stays locked at center
                        const travelP = Math.min(p / 0.6, 1)

                        const rect = target.getBoundingClientRect()
                        const targetCX = rect.left + rect.width / 2
                        const targetCY = rect.top + rect.height / 2

                        const startW = getStartW()
                        const endW = getCenterBeanW()
                        const currentW = startW + (endW - startW) * travelP

                        const vw = window.innerWidth
                        const fixedRight = ((vw - targetCX - currentW / 2) / vw) * 100
                        const fixedTop = ((targetCY - currentW / 2) / window.innerHeight) * 100

                        gsap.set(bean, {
                            top: `${12 + (fixedTop - 12) * travelP}%`,
                            right: `${3 + (fixedRight - 3) * travelP}%`,
                            width: `${currentW}px`,
                            opacity: 1,
                            filter: "blur(0px)",
                        })
                    },

                    // section fully scrolled past — bean stays visible at center
                    onLeave: () => {
                        lockAtCenter()
                        gsap.to(bean, { opacity: 0, duration: 0.4, ease: "power2.in" })
                    },

                    // scrolled back into section from below — restore opacity
                    onEnterBack: () => {
                        gsap.to(bean, { opacity: 1, duration: 0.2 })
                    },

                    // scrolled back above the section — return to h-scroll position
                    onLeaveBack: () => {
                        gsap.to(bean, {
                            top: "12%",
                            right: "3%",
                            width: `${getStartW()}px`,
                            opacity: 1,
                            filter: "blur(0px)",
                            duration: 2.5,
                            ease: "power2.out",
                        })
                    },
                })
            }

        })

        return () => ctx.revert()
    }, [beanRef, hScrollContainerRef, beanCenterRef])
}