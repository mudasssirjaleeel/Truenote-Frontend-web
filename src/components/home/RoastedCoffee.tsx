import React, { useEffect, useState, useRef } from "react";
import subscibe_bg from "../../assets/videos/subscribe_bg_video.mp4";
import bgImg from "../../assets/svgs/input_bg.png";

const RoastedCoffee = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("orientationchange", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("orientationchange", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasAnimated(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background Video with gradual margin animation */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-1000 ease-out ${
          isInView ? "ml-0 mr-0" : "ml-[60px] mr-[60px]"
        }`}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={subscibe_bg} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Top Right Shape Image */}
      <div className="lg:block hidden absolute top-[-10px] right-0 z-10 pointer-events-none">
        <img
          src={bgImg}
          alt="decoration"
          className="w-full md:w-[600px] h-auto max-w-full max-h-[30vh] object-contain"
          style={{
            filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 h-full flex flex-col justify-between">
        {/* Top Right Subscribe Form */}
        <div className="flex justify-end px-3 sm:px-4 lg:px-8 pt-4 lg:pt-0">
          <div className={`${!isLargeScreen ? "w-full max-w-full px-2" : "w-full max-w-md"}`}>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full ${
                  !isLargeScreen ? "px-6 py-6" : "px-6 sm:px-6 py-8"
                } bg-[#191919] backdrop-blur-md rounded-full text-white placeholder-white/80
                  focus:outline-none focus:ring-2 focus:ring-[#F7D5A0] text-xs font-bold
                  sm:text-sm lg:text-[14px] border border-white/30 ${
                    !isLargeScreen ? "pr-28" : "pr-36"
                  }`}
              />
              <button
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${
                  !isLargeScreen ? "px-4 py-4" : "px-4 sm:px-6 py-3 sm:py-5"
                } bg-[#F7D5A0] hover:bg-[#e8c48a] rounded-full text-[#474653] font-bold transition-all 
                duration-300 flex items-center justify-center gap-1 text-[10px] sm:text-xs lg:text-sm 
                shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap`}
              >
                Subscribe
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F7D5A0"
                  strokeWidth="2.5"
                  className="sm:w-3 sm:h-3 lg:w-6 lg:h-6 transition-transform group-hover:translate-x-1 bg-[#474653] rounded-full"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div
          className={`flex-1 flex ${
            !isLargeScreen ? "items-center justify-center" : "items-end"
          } pb-8 sm:pb-12 lg:pb-20 px-4 sm:px-6 lg:px-10`}
        >
          <div
            className={`w-full flex flex-col ${
              !isLargeScreen
                ? "items-center text-center gap-4"
                : "lg:flex-row gap-6 lg:gap-8 justify-between items-start lg:items-end"
            } px-4 sm:px-6 lg:px-8`}
          >
            {/* Left Column - Smooth slide from top */}
            <div
              className={`flex-1 ${!isLargeScreen ? "text-center" : ""} transition-all duration-800 ease-out ${
                isInView
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-[100px] opacity-0"
              }`}
              style={{ transitionDelay: hasAnimated ? "200ms" : "0ms" }}
            >
              <h3 className="text-white">
                <span
                  className={`${
                    !isLargeScreen ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl lg:text-4xl"
                  } text-[#F7D5A0] font-semibold block transition-all duration-700`}
                >
                  Subscribe &
                </span>
                <span
                  className={`${
                    !isLargeScreen ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"
                  } text-[#F7D5A0] font-bold block mt-1 transition-all duration-700`}
                >
                  Save Up To 10%
                </span>
              </h3>
            </div>

            {/* Right Column - Smooth slide from bottom */}
            <div
              className={`${
                !isLargeScreen ? "text-center" : "lg:text-right"
              } w-full lg:w-auto transition-all duration-800 ease-out ${
                isInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[100px] opacity-0"
              }`}
              style={{ transitionDelay: hasAnimated ? "400ms" : "0ms" }}
            >
              <p
                className={`text-[#F7D5A0] ${
                  !isLargeScreen ? "text-xs sm:text-sm" : "text-sm sm:text-base lg:text-lg"
                } font-semibold max-w-md lg:max-w-sm ${
                  !isLargeScreen ? "mx-auto" : ""
                } transition-all duration-700`}
              >
                Get brew guides, limited drops, and subscribe only perks sent
                straight to your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoastedCoffee;