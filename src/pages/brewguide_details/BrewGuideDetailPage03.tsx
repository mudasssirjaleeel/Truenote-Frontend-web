import React from "react";
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";

import heroImg from "../../assets/images/bg_04.png";
import beanOverlay from "../../assets/images/img_20.svg";
import beans_img from "../../assets/images/img_08.svg";
import bg_left_img from "../../assets/svgs/brew_det_01.svg";
import bg_right_img from "../../assets/svgs/brew_det_02.svg";
import galleryImg from "../../assets/images/img_21.svg";

const BackArrow = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M15 10H5M5 10L10 5M5 10L10 15"
      stroke="#F7D5A0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrewGuideDetailPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#E2C4A7]">
      <Header />

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      {/* Hero Section - Responsive for all screens */}
      <div className="relative w-full z-[1] h-[300px] xs:h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[750px] 2xl:h-[850px]">
        {/* bg */}
        <img
          src={heroImg}
          alt="Hario V60 brew guide"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.8]"
        />

        {/* back button */}
        <Link
          to="/brew_guide"
          className="absolute z-10 left-[5%] md:left-[8%] top-[20%] sm:top-[15%] md:top-[14%] w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#090909] flex items-center justify-center"
        >
          <BackArrow />
        </Link>

        {/* tagline - visible on all screens with mobile-optimized positioning */}
        <p
          className="absolute z-[3] 
               text-right font-semibold text-[#F7D5A0] leading-5 sm:leading-7 lg:leading-8
               text-[clamp(0.65rem,3.5vw,0.85rem)] sm:text-[clamp(0.9rem,2vw,1.2rem)] lg:text-[1.5rem]
               w-[clamp(130px,40vw,200px)] sm:w-[clamp(200px,28vw,350px)] lg:w-[409px]
               right-[clamp(8px,3%,40px)] sm:right-[clamp(20px,5vw,60px)] lg:right-[80px]
               bottom-[clamp(10px,3%,25px)] sm:bottom-[clamp(30px,5%,60px)] lg:bottom-[100px]
               hidden xs:block"
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          <span className="xs:hidden sm:inline">
            Redefining coffee culture—one brew at a time
          </span>
          <span className="hidden xs:inline sm:hidden">
            Redefining coffee culture
          </span>
          <span className="hidden sm:inline">
            Join us in redefining coffee culture—one thoughtful brew at a time
          </span>
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          BREW INFO
      ══════════════════════════════════════════════ */}
      <div className="relative z-[1] overflow-hidden px-5 sm:px-8 lg:px-[37px] py-12 lg:py-20">
        {/* BG bottom-left */}
        <div className="absolute bottom-0 left-0 z-0 pointer-events-none w-[40vw] max-w-[480px]">
          <img
            src={bg_left_img}
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain block opacity-30 sm:opacity-60 lg:opacity-100"
          />
        </div>

        {/* BG top-right */}
        <div className="absolute top-0 right-0 z-0 pointer-events-none w-[32vw] max-w-[420px]">
          <img
            src={bg_right_img}
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain block opacity-30 sm:opacity-60 lg:opacity-100"
          />
        </div>

        {/* BG beans center */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <img
            src={beans_img}
            alt=""
            aria-hidden="true"
            className="object-contain
                       opacity-20 sm:opacity-40 lg:opacity-70
                       w-[160px] sm:w-[240px] lg:w-[320px] xl:w-[383px]
                       max-h-[277px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1450px] 2xl:max-w-[1700px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-20 xl:gap-[100px] 2xl:gap-[159px]">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-10 2xl:gap-12 min-w-0">
              {/* ratio statement */}
              <p
                className="text-[#474653] leading-snug"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                <span className="font-semibold text-[clamp(1rem,2vw,2rem)]">
                  We will use a 1:17 ratio to brew 20 grams of{" "}
                </span>
                <span className="font-semibold text-[clamp(1.4rem,3.2vw,3.5rem)]">
                  coffee.
                </span>
              </p>

              {/* equipment */}
              <div className="flex flex-col gap-3 lg:gap-6 max-w-[336px]">
                <p
                  className="font-semibold text-[#474653] text-[clamp(0.95rem,1.4vw,1.5rem)] leading-8"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  Set your table with the following–
                </p>
                <ol
                  className="text-[#474653] font-medium
                             text-[clamp(0.8rem,1.1vw,1rem)]
                             leading-[clamp(2rem,3vw,2.5rem)]"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {[
                    "Chemex Brewer",
                    "Chemex Filter Paper",
                    "Gooseneck Kettle",
                    "Coffee Grinder",
                    "Gram scale",
                    "Timer",
                    "20 grams whole bean coffee",
                    "500 grams of filtered hot water (91 to 94 C)",
                  ].map((item, index) => (
                    <li key={item}>
                      {index + 1}. {item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-[420px] xl:w-[480px] 2xl:w-[550px] flex-shrink-0 flex flex-col items-start lg:items-end gap-5 lg:gap-8">
              <h2
                className="w-full text-left lg:text-right font-semibold text-[#474653]
                           text-[clamp(1.1rem,2vw,2rem)] leading-snug"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                General Brewing Guidelines
              </h2>

              <div className="flex flex-col items-start lg:items-end gap-4 lg:gap-6 2xl:gap-8 w-full lg:max-w-[396px]">
                {[
                  "1. In this brew guide, we will use a 1:17 ratio to brew 20 grams of coffee using the 40:60 ratio technique. That means we will brew 20 grams of coffee with 340 grams/ml of water.",
                  "2. The 40:60 brewing technique refers to a method where the coffee-to-water ratio is intentionally adjusted to optimize extraction and flavor.",
                  "3. The first 40% of the total brew time (90 seconds) and water (136 ml) is used for blooming and the first part of extraction. This helps to release CO2 and saturate the grounds, setting the stage for an even extraction.",
                  "4. The remaining 60% of the water (204 ml) is added in one steady pour, maintaining a consistent flow to ensure proper extraction.",
                  "5. Total brew time is between 3:30 and 4:00 minutes.",
                ].map((text, i) => (
                  <p
                    key={i}
                    className="text-left lg:text-right font-medium text-[#474653]
                               text-[clamp(0.8rem,1.1vw,1rem)]
                               leading-[clamp(1.75rem,2.5vw,2rem)]"
                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden z-[1] h-[300px] sm:h-[420px] md:h-[560px] lg:h-[660px] xl:h-[754px]">
        <img
          src={galleryImg}
          alt="Brewing process"
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
          style={{ filter: "blur(2.85px)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     flex items-center justify-center cursor-pointer
                     bg-white rounded-[95px] p-4
                     shadow-[0px_0px_15px_rgba(0,0,0,0.50)]"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M8 5L23 14L8 23V5Z" fill="#474653" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BrewGuideDetailPage;
