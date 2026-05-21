import React, { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useBeans } from '@/hooks/useBeans'
import { getImageUrl, getImageUrlFromObject } from '@/utils/imageUrl';


import heroImg from '../assets/images/img_22.svg'
import featuredImg from '../assets/images/img_01.svg'
import ctaBgVideo from '../assets/videos/hero_bg.mp4'
import SignatureCoffee from '@/components/home/SignatureCoffee'
import pack_01 from '../assets/images/pack_01.svg'

interface FeaturedBean {
    id: string
    name: string
    origin: string
    roastLevel: string
    flavorNotes: string
    process: string
    description: string
    imageUrl: string
    price: number
    weight: number
}

 

const ArrowIcon = () => (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 7L7 1M7 1H2M7 1V6" stroke="#474653" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const PaginationDots = ({ current, total, onDotClick }: { current: number; total: number; onDotClick: (index: number) => void }) => (
    <div className="flex items-center gap-3">
        {Array.from({ length: total }).map((_, index) => (
            <button
                key={index}
                onClick={() => onDotClick(index)}
                className={`transition-all duration-300 cursor-pointer ${current === index
                    ? 'w-12 h-4 rounded-full bg-[#D9D9D9]'
                    : 'w-4 h-4 rounded-full bg-[rgba(217,217,217,0.60)] hover:bg-[rgba(217,217,217,0.8)]'
                    }`}
            />
        ))}
    </div>
)

const CoffeeBeansPage = () => {
    const { beans, loading, getBeans } = useBeans(false)
    const [featuredBeans, setFeaturedBeans] = useState<FeaturedBean[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        getBeans({ limit: 10 })
    }, [])

    useEffect(() => {
        if (beans && beans.length > 0) {
            // Transform beans to featured format
            const transformed = beans.map((bean) => ({
                id: bean.id,
                name: bean.name,
                origin: bean.origin,
                roastLevel: bean.isDark ? 'Dark' : 'Light',
                flavorNotes: bean.description?.split(',').slice(0, 3).join(', ') || 'Citrus, Floral, Honey',
                process: 'Washed',
                description: bean.description || `Sourced from the highlands of ${bean.origin}, this single-origin coffee delivers a vibrant and complex cup.`,
                imageUrl: getImageUrl(bean.imageUrl) || pack_01,
                price: Number(bean.price),
                weight: bean.weight,
            }))
            setFeaturedBeans(transformed)
        }
    }, [beans])

    // Auto-rotate carousel every 5 seconds
    useEffect(() => {
        if (featuredBeans.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredBeans.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [featuredBeans.length])

    const handleDotClick = (index: number) => {
        setCurrentIndex(index)
    }

    const currentBean = featuredBeans[currentIndex]

    if (loading && featuredBeans.length === 0) {
        return (
            <div className="relative min-h-screen overflow-x-hidden bg-[#E2C4A7]">
                <Header />
                <div className="relative w-full h-[320px] sm:h-[420px] md:h-[600px] lg:h-[838px] overflow-hidden bg-gray-800 animate-pulse" />
                <SignatureCoffee />
                <div className="relative w-full overflow-hidden mb-1 lg:mb-10 h-auto lg:h-[831px] bg-gray-800 animate-pulse" />
            </div>
        )
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#E2C4A7]">
            <Header />

            {/* Hero Section */}
            <div className="relative w-full h-[320px] sm:h-[420px] md:h-[600px] lg:h-[838px] overflow-hidden">
                <img
                    src={heroImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute left-[5%] lg:left-20 top-[30%] lg:top-[36%] w-[90%] lg:max-w-[1224px] z-10">
                    <h1
                        className="text-[#F7D5A0] font-bold leading-[1.25] text-[clamp(1.4rem,6vw,5.2rem)]"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                    >
                        Single-Origin Coffee Beans
                        from Around the World
                    </h1>
                </div>
            </div>

            <SignatureCoffee />

            {/* Featured Section with Carousel */}
            <div className="relative w-full overflow-hidden mb-1 lg:mb-10 h-auto lg:h-[831px]">
                {/* bg image */}
                <img
                    src={featuredImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />

                <AnimatePresence mode="wait">
                    {currentBean && (
                        <>
                            {/* ── MOBILE / TABLET layout (below lg): stacked ── */}
                            <motion.div
                                key={`mobile-${currentIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10 flex flex-col items-center gap-6 px-5 pt-10 pb-16 lg:hidden"
                            >
                                {/* product image */}
                                <img
                                    src={currentBean.imageUrl}
                                    alt={currentBean.name}
                                    className="w-[200px] sm:w-[260px] rounded-2xl object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = pack_01
                                    }}
                                />

                                {/* detail card */}
                                <div
                                    className="w-full max-w-[360px] p-4 rounded-3xl flex items-start gap-6"
                                    style={{ background: 'rgba(255,151,151,0.50)', backdropFilter: 'blur(4px)' }}
                                >
                                    <div className="flex flex-col gap-4">
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>Origin :</span>
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>Roast Level :</span>
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>Flavor Notes :</span>
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>Process :</span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.origin}</span>
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.roastLevel}</span>
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.flavorNotes}</span>
                                        <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.process}</span>
                                    </div>
                                </div>

                                {/* description */}
                                <p
                                    className="text-center text-white text-sm sm:text-base font-medium leading-6 max-w-[480px]"
                                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                                >
                                    {currentBean.description}
                                </p>

                                {/* buy now button */}
                                <Link
                                    to={`/product/${currentBean.id}`}
                                    className="w-[220px] h-[56px] relative bg-[#474653] rounded-[75px] overflow-hidden flex items-center justify-center cursor-pointer group hover:bg-[#5a5a6b] transition-all"
                                >
                                    <div className="absolute left-0 top-4 w-11 h-11 rounded-full bg-[#ADADAD]" style={{ filter: 'blur(35px)' }} />
                                    <span className="relative text-[#E2C4A7] text-xl font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                        Buy Now - ${currentBean.price.toFixed(2)}
                                    </span>
                                </Link>

                                {/* pagination */}
                                <PaginationDots current={currentIndex} total={featuredBeans.length} onDotClick={handleDotClick} />
                            </motion.div>

                            {/* ── DESKTOP layout (lg+): absolute positioned ── */}
                            <motion.div
                                key={`desktop-${currentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="hidden lg:block"
                            >
                                {/* white glow */}
                                <div
                                    className="absolute z-[1] pointer-events-none"
                                    style={{ width: 478, height: 607, left: 154, top: 114, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, filter: 'blur(133px)' }}
                                />

                                {/* product image */}
                                <motion.img
                                    key={`img-${currentIndex}`}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    src={currentBean.imageUrl}
                                    alt={currentBean.name}
                                    className="absolute z-[2] rounded-2xl object-cover"
                                    style={{ width: 417, height: 574, left: '13.4%', top: '8.7%' }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = pack_01
                                    }}
                                />

                                {/* detail card */}
                                <motion.div
                                    key={`details-${currentIndex}`}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="absolute z-[3] top-[9%] right-[5%] p-4 rounded-3xl flex items-center gap-10"
                                    style={{ background: 'rgba(255,151,151,0.50)', backdropFilter: 'blur(4px)' }}
                                >
                                    <div className="flex flex-col gap-6">
                                        <span className="text-white text-base lg:text-lg font-medium whitespace-nowrap" style={{ fontFamily: "'League Spartan', sans-serif" }}>Origin :</span>
                                        <span className="text-white text-base lg:text-lg font-medium whitespace-nowrap" style={{ fontFamily: "'League Spartan', sans-serif" }}>Roast Level :</span>
                                        <span className="text-white text-base lg:text-lg font-medium whitespace-nowrap" style={{ fontFamily: "'League Spartan', sans-serif" }}>Flavor Notes :</span>
                                        <span className="text-white text-base lg:text-lg font-medium whitespace-nowrap" style={{ fontFamily: "'League Spartan', sans-serif" }}>Process :</span>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <span className="text-white text-base lg:text-lg font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.origin}</span>
                                        <span className="text-white text-base lg:text-lg font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.roastLevel}</span>
                                        <span className="text-white text-base lg:text-lg font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.flavorNotes}</span>
                                        <span className="text-white text-base lg:text-lg font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{currentBean.process}</span>
                                    </div>
                                </motion.div>

                                {/* description + buy */}
                                <motion.div
                                    key={`cta-${currentIndex}`}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="absolute z-[3] right-[5%] bottom-[8%] flex flex-col items-end gap-6 w-[509px]"
                                >
                                    <p
                                        className="text-right text-white text-sm font-medium leading-6"
                                        style={{ fontFamily: "'League Spartan', sans-serif", maxWidth: 464 }}
                                    >
                                        {currentBean.description}
                                    </p>
                                    <Link
                                        to={`/coffee_beans/${currentBean.id}`}
                                        className="w-[264px] h-[62px] relative bg-[#474653] rounded-[75px] overflow-hidden flex items-center cursor-pointer group hover:bg-[#5a5a6b] transition-all"
                                    >
                                        <div className="absolute left-0 top-6 w-11 h-11 rounded-full bg-[#ADADAD]" style={{ filter: 'blur(35px)' }} />
                                        <span className="absolute left-[86px] text-[#E2C4A7] text-2xl font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                            Buy Now
                                        </span>
                                    </Link>
                                </motion.div>

                                {/* pagination */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3]">
                                    <PaginationDots current={currentIndex} total={featuredBeans.length} onDotClick={handleDotClick} />
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* CTA Section with Video */}
            <div className="relative w-full overflow-hidden lg:mb-20 h-[420px] sm:h-[480px] lg:h-[777px]">
                {/* bg video */}
                <video
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={ctaBgVideo} type="video/mp4" />
                </video>

                {/* content */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
                    <div className="flex flex-col items-center gap-6 lg:gap-10 text-center">
                        <h2
                            className="text-[#F7D5A0] font-semibold leading-tight  text-[30px] md:text-[36px] xl:text-[42px] 2xl:text-[50px]"
                            style={{ fontFamily: "'League Spartan', sans-serif" }}
                        >
                            Find Coffee That Matches Your Mood
                        </h2>
                        <p
                            className="text-[#F7D5A0]  leading-7 lg:leading-8  text-[16px] md:text-[20px] xl:text-[22px] 2xl:text-[24px]"
                            style={{ fontFamily: "'League Spartan', sans-serif" }}
                        >
                            From bold and intense to smooth and aromatic <br className='hidden md:block' /> — explore flavors crafted for every moment.
                        </p>
                        <p
                            className="text-[#F7D5A0]  leading-7 lg:leading-8 text-[16px] md:text-[20px] xl:text-[22px] 2xl:text-[24px]"
                            style={{ fontFamily: "'League Spartan', sans-serif" }}
                        >
                            Learn how to brew like a pro
                        </p>
                        <Link
                            to="/brew_guide"
                            className="flex items-center gap-3 px-5 py-3 lg:px-10 lg:py-4 rounded-[76px] bg-[#E19D5E] hover:bg-[#c88a4e] transition-all cursor-pointer"
                        >
                            <span
                                className="text-[#333333] text-sm lg:text-base font-semibold"
                                style={{ fontFamily: "'League Spartan', sans-serif" }}
                            >
                                Explore Brew Guides
                            </span>
                            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-[#F7D5A0] rounded-full flex items-center justify-center">
                                <ArrowIcon />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoffeeBeansPage