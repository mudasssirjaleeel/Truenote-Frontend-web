// pages/HomePage.tsx
import { useRef } from "react";
import Header from "@/components/layout/Header";
import HorizontalScroll from "@/components/about/HorizontalScroll";
import hero_vid from "../assets/videos/hero_bg.mp4";
import img_01 from "../assets/images/img_01.svg";
import img_02 from "../assets/images/img_06.png";
import img_03 from "../assets/images/img_03.svg";
import img_04 from "../assets/images/img_02.svg";
import img_05 from "../assets/images/img_05.svg";
import img_06 from "../assets/images/img_04.svg";
import img_12 from "../assets/images/img_12.svg";
import beans from "../assets/images/beans.svg";
import wave1 from "../assets/svgs/wave_01.svg";
import wave2 from "../assets/svgs/wave_02.svg";
import wave3 from "../assets/svgs/wave_03.svg";
import beans_img from "../assets/images/img_08.svg";
import { Link } from "react-router-dom";
import SignatureCoffee from "@/components/home/SignatureCoffee";
import { BeansAnnotation } from "@/components/about/Beansannotation";
import { useTravellingBean } from "@/hooks/useTravellingBean";
import { useHeadingSwap } from "@/hooks/useHeadingSwap";

const HomePage = () => {
  // ── refs for the travelling bean animation ──
  const travellingBeanRef = useRef<HTMLImageElement>(null);
  const hScrollContainerRef = useRef<HTMLDivElement>(null);
  const beanCenterRef = useRef<HTMLDivElement>(null);

  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const heading3Ref = useRef<HTMLHeadingElement>(null);

  useHeadingSwap({
    containerRef: hScrollContainerRef,
    headingRefs: [heading1Ref, heading2Ref, heading3Ref],
  });

  // ── drive the animation ──
  useTravellingBean({
    beanRef: travellingBeanRef,
    hScrollContainerRef,
    beanCenterRef,
  });

  return (
    <div className="relative">
      {/* ════════════════════════════════════════════════════
          TRAVELLING BEAN — one image, lives here, animated
          by useTravellingBean across all scroll phases.
          position:fixed is set by GSAP, not inline style.
      ════════════════════════════════════════════════════ */}
      <img
        ref={travellingBeanRef}
        src={beans_img}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none"
        style={{ position: "fixed", zIndex: 40 }}
      />

      {/* ── Fixed Header ── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div>
        {/* ════════════════════════════════════════
            HERO — scrolls normally
            NOTE: removed the static beans_img here
            because it is now the travelling bean above
        ════════════════════════════════════════ */}
        <section className="relative w-full min-h-screen overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster="/about-hero-poster.jpg"
            >
              <source src={hero_vid} type="video/mp4" />
            </video>
          </div>

          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at 0% 100%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
            }}
          />

          <div className="relative z-10 container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-4xl mt-12 lg:mt-12 2xl:mt-20">
              <h1 className="text-[26px] sm:text-[30px] lg:text-[50px] 2xl:text-[76px] font-bold text-[#F7D5A0] leading-tight mb-6">
                Our Story Begins with <br className="hidden md:block" />
                Great Coffee
              </h1>
              <p className="text-[16px] sm:text-[18px] text-[#F7D5A0] leading-relaxed md:w-[55%] font-semibold 2xl:mt-30 xl:mt-24 lg:mt-20 mt-6 mb-10">
                At Truenote Coffee Company, we believe that good coffee should
                be both accessible and exceptional. Our mission is simple — to
                help people experience better coffee every day. At Truenote,
                coffee isn't just a drink — it's a connection between people,
                farms, and flavours from around the world. Each bean is
                ethically sourced and roasted with care for a mindful coffee
                experience.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-6">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto text-center group flex items-center justify-center gap-3 px-6 py-3 bg-[#F7D5A0] rounded-full hover:bg-[#e8c48a] transition-all duration-300"
                >
                  <span className="text-[#474653] font-medium">
                    Explore Menu
                  </span>
                  <div className="w-8 h-8 bg-[#474653] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M1 6H11M11 6L6 1M11 6L6 11"
                        stroke="#F7D5A0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </Link>
                <Link
                  to="/coffee_beans"
                  className="w-full sm:w-auto text-center px-6 py-3 border-2 border-[#F7D5A0] rounded-full text-[#F7D5A0] font-medium hover:bg-[#F7D5A0]/10 transition-all duration-300"
                >
                  Shop Coffee Beans
                </Link>
              </div>
            </div>
          </div>
          {/* ↑ static beans_img removed — replaced by travelling bean above */}
        </section>

        {/* ════════════════════════════════════════
            HORIZONTAL SCROLL — pass ref so the hook
            knows when the pin starts/ends
        ════════════════════════════════════════ */}
        <HorizontalScroll sectionCount={3} containerRef={hScrollContainerRef}>
          {/* ── SECTION 2 — From mindful farms (UNCHANGED) ── */}
          <section
            className="relative w-screen h-screen min-h-[600px] overflow-hidden flex-shrink-0 flex md:flex-col"
            style={{ background: "#1c1208", fontFamily: "'Lato', sans-serif" }}
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src={img_01}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
           <div className="absolute bottom-0 left-0 w-full z-[1] pointer-events-none">
  <img
    src={wave1}
    alt=""
    aria-hidden="true"
    className="w-full block"
    style={{ display: "block", verticalAlign: "bottom" }}
  />
</div>
            <div className="absolute bottom-0 left-0 z-[2] pointer-events-none">
              <img
                src={img_02}
                alt=""
                className="block pl-6 pb-6 lg:pl-10 lg:pb-10
                           w-[75vw] sm:w-[60vw] md:w-[55vw] lg:w-[50vw] xl:w-[45vw]
                           max-w-[900px]
                           opacity-40 sm:opacity-60 lg:opacity-100"
              />
            </div>
            <div className="relative z-10 flex flex-col h-full px-[5%] pt-10 lg:pt-16">
              <div className="overflow-hidden flex-shrink-0">
                <h2
                  ref={heading1Ref}
                  className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] 2xl:text-[60px] font-semibold leading-[1.2] text-[#F7D5A0] md:mt-4 lg:mt-2 2xl:mt-14"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                  }}
                >
                  From mindful farms to
                  <br className="hidden md:block" />
                  meaningful cups
                </h2>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-3 mt-4 lg:mt-6 flex-shrink-0 lg:self-end lg:w-[45%]">
                {/* <img src={beans} alt="coffee beans" className="w-[52px] lg:w-[70px] opacity-90" /> */}
                <p className="text-[16px] xl:text-[18px] 2xl:text-[22px] text-[#F7D5A0] font-light leading-[1.4] md:leading-[2] text-end ">
                  We carefully source single-origin, specialty-grade beans from
                  farms around the world that are known for their commitment to
                  quality, sustainability, and ethical farming practices. Each
                  origin we work with represents the best in coffee farming and
                  processing — from soil to harvest to roast.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 3 — Roasted in Small Batches (UNCHANGED) ── */}
          <section
            className="relative w-screen h-screen min-h-[600px] overflow-hidden flex-shrink-0 flex flex-col"
            style={{ background: "#1c1208", fontFamily: "'Lato', sans-serif" }}
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src={img_03}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full z-[1] pointer-events-none">
              <img
                src={wave2}
                alt=""
                aria-hidden="true"
                className="w-full block -mb-8"
                style={{
                  display: "block",
                  verticalAlign: "bottom",
                  padding: 0,
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 z-[2] pointer-events-none">
              <img
                src={img_04}
                alt=""
                className="block pl-6 pb-6 lg:pl-10 lg:pb-10
                           w-[70vw] sm:w-[55vw] md:w-[48vw] lg:w-[40vw] xl:w-[32vw]
                           max-w-[650px]
                           opacity-40 sm:opacity-60 lg:opacity-100"
              />
            </div>
            <div className="relative z-10 h-full px-[5%] pt-10 lg:pt-12">
              <div className="overflow-hidden flex-shrink-0">
                <h2
                  ref={heading2Ref}
                  className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] 2xl:text-[60px] font-semibold leading-[1.2] text-[#F7D5A0] md:mt-4 lg:mt-2 2xl:mt-14"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                  }}
                >
                  Roasted in Small Batches.
                  <br />
                  Brewed to Perfection.
                </h2>
              </div>

              <div className="absolute top-[35%] right-[15%] z-10 flex flex-col items-end gap-3 sm:w-[80%] lg:w-[90%] xl:w-[50%] px-4 sm:px-0">
                {/* <img src={beans} alt="coffee beans" className="w-[52px] lg:w-[160px] xl:w-[200px] opacity-90" /> */}
                <p className="text-[16px] xl:text-[18px] 2xl:text-[22px] text-[#F7D5A0] font-light leading-[1.4] md:leading-[2] text-start">
                  While many brands rely on bold, dark roasts to create a
                  consistent flavour, we take a more intentional path—starting
                  with exceptional, high-quality beans selected for their unique
                  character. We meticulously roast each bean to bring out its
                  natural sweetness, subtle nuance, and origin-specific flavour.
                  At TrueNote, every batch is crafted with care and precision to
                  let the coffee express itself with clarity—not be overshadowed
                  by uniformity.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 4 — Our Cafe (UNCHANGED) ── */}
          <section
            className="relative w-screen h-screen min-h-[600px] overflow-hidden flex-shrink-0 flex flex-col"
            style={{ background: "#1c1208", fontFamily: "'Lato', sans-serif" }}
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src={img_05}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full z-[1] pointer-events-none">
              <img
                src={wave3}
                alt=""
                aria-hidden="true"
                className="w-full block -mb-8"
                style={{ display: "block", verticalAlign: "bottom" }}
              />
            </div>
            <div className="absolute bottom-0 right-0 z-[2] pointer-events-none">
              <img
                src={img_06}
                alt=""
                className="block pr-6 pb-6 lg:pr-10 lg:pb-10
                           w-[70vw] sm:w-[55vw] md:w-[48vw] lg:w-[40vw] xl:w-[32vw]
                           max-w-[650px]
                           opacity-40 sm:opacity-60 lg:opacity-100"
              />
            </div>
            <div className="relative z-10 flex flex-col h-full px-[5%] pt-10 lg:pt-12">
              <h2
                ref={heading3Ref}
                className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] 2xl:text-[60px] font-semibold leading-[1.2] text-[#F7D5A0] md:mt-4 lg:mt-2 2xl:mt-14"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 3.2rem)",
                  fontFamily: "'League Spartan', sans-serif",
                }}
              >
                Our Cafe
              </h2>
              <div className="flex flex-col items-start gap-3 mt-4 lg:mt-6 flex-shrink-0 w-full lg:w-[52%] xl:w-[48%] top-[35%]">
                <p className="text-[16px] xl:text-[18px] 2xl:text-[22px] text-[#F7D5A0] font-light leading-[1.4] md:leading-[2] text-left">
                  Our specialty café in Whitby is more than just a place to
                  enjoy great coffee — it's a space built around connection,
                  curiosity, and care. It was created to bring our roasting
                  philosophy to life, where every cup tells the story of its
                  origin and the people behind it. Beyond the cup, it's a space
                  for conversation, learning, and slowing down — something
                  increasingly rare and deeply needed. Whether you're
                  discovering new flavour notes or catching up with a friend,
                  the café reflects our commitment to quality, transparency, and
                  hospitality.
                </p>
              </div>
            </div>
          </section>
        </HorizontalScroll>

        {/* ════════════════════════════════════════
            COMMITMENT SECTION (UNCHANGED content)
            Only change: beanCenterRef on the wrapper
            div around the center bean image inside
            BeansAnnotation
        ════════════════════════════════════════ */}
        <section
          className="relative w-screen h-screen min-h-[600px] overflow-hidden flex-shrink-0 flex flex-col"
          style={{ background: "#1c1208", fontFamily: "'Lato', sans-serif" }}
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={img_12}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col h-full px-[5%] pt-10 lg:pt-12">
            <h2
              className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] 2xl:text-[60px] font-semibold leading-[1.2] text-[#F7D5A0] md:mt-4 lg:mt-2 2xl:mt-14 flex-shrink-0"
              style={{
                fontFamily: "'League Spartan', sans-serif",
              }}
            >
              Our commitment to taste, quality &amp; ethical sourcing
            </h2>
            <div className="flex flex-col items-start gap-3 mt-4 flex-shrink-0 w-full">
              <p className="text-[16px] md:text-[18px] xl:text-[20px] text-[#F7D5A0] font-light leading-[1.6] 2xl:leading-[2] text-left">
                We prioritize responsible sourcing and long-term partnerships
                with producers who value sustainability and quality. Behind
                every bag of coffee is a network of passionate farmers who
                cultivate exceptional beans with dedication and expertise. By
                working closely with coffee-growing communities, we help support
                ethical practices and fair opportunities for farmers. From the
                farm to our roastery, every step is guided by care and respect
                for the craft of coffee.
              </p>
            </div>

            {/* Pass beanCenterRef so the hook can track the center bean position */}
            <BeansAnnotation beanCenterRef={beanCenterRef} />
          </div>
        </section>

        <SignatureCoffee />
      </div>
    </div>
  );
};

export default HomePage;
