import React, { useEffect, useRef, useState } from "react";
import SwappingCards from "./SwappingCards";
import hero_bg_video from "../../assets/videos/hero_green_bg.mp4";
import bean_icon from "../../assets/hero/bean_btn_icon.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);

  // Morph elements
  const morphRef = useRef(null);
  const centerIconRef = useRef(null);
  const iconWrapperRef = useRef(null);
  const textRef = useRef(null);

  const [viewportHeight, setViewportHeight] = useState("100vh");
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const updateHeight = () => {
      const largeScreen = window.innerWidth >= 768;
      setIsLargeScreen(largeScreen);

      if (largeScreen) {
        setViewportHeight(`${window.innerHeight}px`);
      } else {
        setViewportHeight("auto");
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Auto-play animation on load with delay and slower speed
  useEffect(() => {
    // Delay of 1.5 seconds before animation starts
    const timer = setTimeout(() => {
      if (!animationStarted && window.innerWidth >= 768) {
        setAnimationStarted(true);

        // Set initial state for animation
        gsap.set(morphRef.current, {
          height: "100%",
          width: "100%",
          borderRadius: 0,
          backgroundColor: "#d2b48c",
          backdropFilter: "blur(0px)",
          border: "none",
          y: 0,
          x: 0,
        });

        gsap.set(centerIconRef.current, {
          scale: 1,
          x: 0,
          y: 0,
        });

        gsap.set(textRef.current, {
          x: -150,
          opacity: 0,
        });

        gsap.set(iconWrapperRef.current, {
          scale: 0,
        });

        // Auto animation timeline - SLOWER SPEEDS
        const autoTl = gsap.timeline({
          onComplete: () => {
            // After animation completes, setup scroll trigger to hide button
            setupScrollTrigger();
          },
        });

        // STEP 1: shrink center icon (80px → 40px) - slower
        autoTl.to(
          centerIconRef.current,
          {
            scale: 0.5,
            duration: 2.5,
            ease: "power2.inOut",
          },
          0.5,
        );

        // STEP 2: morph full screen → button - slower
        autoTl.to(
          morphRef.current,
          {
            height: 60,
            width: 220,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.4)",
            y: window.innerHeight - 100,
            x: window.innerWidth / 2 - 110,
            duration: 2.5,
            ease: "power2.inOut",
          },
          0.5,
        );

        // STEP 3: move icon to right - slower
        autoTl.to(
          centerIconRef.current,
          {
            x: 80,
            y: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          2.2,
        );

        // STEP 4: text slides in - slower
        autoTl.to(
          textRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1.8,
            ease: "power3.out",
          },
          3,
        );
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [animationStarted]);

  const setupScrollTrigger = () => {
    // Create scroll trigger to fade out button when leaving hero section
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        // Fade out button as we scroll past hero section
        const progress = self.progress;
        if (progress > 0.7) {
          // Button fades out when leaving hero
          gsap.to(morphRef.current, {
            opacity: 1 - (progress - 0.7) / 0.3,
            duration: 0.1,
            ease: "none",
          });
        } else {
          // Button fully visible in hero
          gsap.to(morphRef.current, {
            opacity: 1,
            duration: 0.1,
            ease: "none",
          });
        }
      },
    });
  };

  return (
    <section
      ref={heroRef}
      className={`relative overflow-hidden ${isLargeScreen ? "lg:h-screen" : "h-auto"}`}
    >
      {/* 🎥 Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={hero_bg_video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 🟤 MORPH CONTAINER - Only visible in hero section */}
      <div
        ref={morphRef}
        className="hidden md:flex fixed w-full h-full z-[9999] items-center justify-center bg-[#d2b48c]"
        style={{ transformOrigin: "center" }}
      >
        {/* BUTTON CONTENT */}
        <div className="flex items-end rounded-full overflow-hidden">
          <span
            ref={textRef}
            className="text-[#553A32] font-semibold opacity-0 rounded-full py-3 px-9 bg-[#E2C4A7]"
          >
            <Link to="/coffee_beans">Shop Beans</Link>
          </span>

          <div
            ref={iconWrapperRef}
            className="flex items-center justify-center rounded-full m-0 scale-0"
          >
            <img src={bean_icon} className="w-12 h-12" alt="bean" />
          </div>
        </div>

        <img
          ref={centerIconRef}
          src={bean_icon}
          alt="bean"
          className="absolute w-[80px] h-[80px]"
        />
      </div>

      {/* Mobile Button (below md) - Shows at bottom */}
      <div className="md:hidden relative w-full z-10 mt-auto pb-8 flex items-center justify-center">
        {/* Add mobile button content here if needed */}
      </div>

      {/* NORMAL HERO CONTENT (behind animation) */}
      <div className="relative z-10 max-w-full mx-auto md:mx-[12px] lg:mx-[40px] px-4 h-full flex flex-col">
        <div className="flex-1 flex flex-col md:justify-center mt-8 md:mt-18">
          <h1 className="text-[26px] lg:text-[35px] xl:text-[50px] 2xl:text-[80px] font-bold text-[#F7D5A0]">
            Crafted for Coffee Lovers
          </h1>
          <p className="text-[#F7D5A0] font-semibold text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[26px] pt-3 sm:pt-0 pb-3 xl:pb-6">
            We are storytellers, curators of quality, and passionate{" "}
            <br className="hidden md:block" /> advocates of speciality coffee
          </p>
          <p className="text-[#F7D5A0] font-semibold text-[16px] lg:text-[20px] xl:text-[18px] 2xl:text-[26px] mb-8 md:mb-0">
            JOIN US IN REDEFINING COFFEE CULTURE
          </p>
        </div>

        <div className="grid sm:grid-cols-3 pb-30 sm:pb-10 items-start md:items-end">
          <div className="md:block hidden"></div>
          <div className="md:block hidden"></div>
          <div className="flex justify-center md:justify-end">
            <SwappingCards />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;