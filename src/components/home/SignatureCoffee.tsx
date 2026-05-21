import React, { useEffect, useState, useRef } from "react";
import { useBeans } from "@/hooks/useBeans";
import pack_01 from "../../assets/images/pack_01.svg";
import { Link } from "react-router-dom";
import { getImageUrl, getImageUrlFromObject } from "@/utils/imageUrl";
import canada_flag from "../../assets/images/canada_flag.png";

const SignatureCoffee = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const { beans, loading, getBeans } = useBeans(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const [animateHeading, setAnimateHeading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAnimateHeading(entry.isIntersecting);
      },
      {
        threshold: 0.6,
        rootMargin: "0px 0px -100px 0px",
      },
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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);

      // Adjust cards per view based on screen size
      if (window.innerWidth >= 1024) {
        setCardsPerView(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(2);
      }
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
    getBeans({ limit: 20 }); // Fetch more beans for carousel
  }, []);

  // Convert full URL to relative path for proxy
  // const getImageUrl = (url: string | null) => {
  //   if (!url) return pack_01;
  //   if (url.includes('localhost:5000')) {
  //     const urlObj = new URL(url);
  //     return urlObj.pathname;
  //   }
  //   return url;
  // };

  const coffeeCards = beans.map((bean) => ({
    id: bean.id,
    name: bean.name,
    weight: `${bean.weight} gm`,
    origin: bean.origin,
    price: `$${Number(bean.price).toFixed(2)}`,
    image: getImageUrl(bean.imageUrl),
  }));

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (coffeeCards.length > cardsPerView) {
      // Loop to the end
      setCurrentIndex(Math.max(0, coffeeCards.length - cardsPerView));
    }
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, coffeeCards.length - cardsPerView);
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    } else if (coffeeCards.length > cardsPerView) {
      // Loop to start
      setCurrentIndex(0);
    }
  };

  // Get visible cards
  const visibleCards = coffeeCards.slice(
    currentIndex,
    currentIndex + cardsPerView,
  );

  // Check if navigation buttons should be disabled
  const isPrevDisabled =
    currentIndex === 0 && coffeeCards.length <= cardsPerView;
  const isNextDisabled =
    currentIndex >= coffeeCards.length - cardsPerView &&
    coffeeCards.length <= cardsPerView;

  if (loading && coffeeCards.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-[#E2C4A7] py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#474653] border-r-transparent"></div>
            <p className="mt-4 text-[#474653]">Loading coffee beans...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#E2C4A7] py-8 sm:py-12 lg:py-16 xl:py-20 mb-30"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-full mx-[6px] md:mx-[12px] lg:mx-[40px] px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className={`mb-4 sm:mb-6 lg:mb-8 ${animateHeading ? "heading-animate" : "opacity-0 translate-y-[100px]"}`}
        >
          <div className="flex flex-col sm:justify-between sm:items-start gap-3 sm:gap-4">
            <h2
              className={`text-[#474653] text-xl sm:text-2xl md:text-2xl lg:text-[36px] font-bold leading-tight text-start sm-left transition-all duration-700 ${
                animateHeading
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[60px]"
              }`}
            >
              Specialty Coffee Beans, Ethically Sourced{" "}
              <br className="hidden sm:block" />
              Roasted in Small Batches
            </h2>
            {/* Navigation Arrows */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
              <button
                onClick={handlePrevious}
                disabled={isPrevDisabled}
                className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full border border-[#2d2c35] transition-all ${
                  isPrevDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#474653]/10 cursor-pointer"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2d2c35"
                  strokeWidth="2"
                  className="sm:w-6 sm:h-6"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-[#1f1d36] transition-all ${
                  isNextDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#5a5a6b] cursor-pointer"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="sm:w-6 sm:h-6"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            ref={containerRef}
            className="transition-all duration-1000 ease-out"
          >
            {/* Coffee Cards Grid - Dynamic based on currentIndex */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cardsPerView} gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10`}
            >
              {visibleCards.map((card, index) => (
                <div
                  key={card.id || `${currentIndex}-${index}`}
                  className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all duration-300 hover:transform hover:scale-105 animate-fadeIn"
                  style={{
                    background: "rgba(255, 222, 190, 0.50)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  {/* Card Image */}
                  <div className="mb-2 sm:mb-3">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full aspect-[3/4] object-cover rounded-lg sm:rounded-xl"
                      onError={(e) => {
                        console.error(`Failed to load image: ${card.image}`);
                        (e.target as HTMLImageElement).src = pack_01;
                      }}
                    />
                  </div>

                  {/* Card Info */}
                  <div className="mb-2 sm:mb-3">
                    <div className="flex justify-between items-start mb-0.5 sm:mb-1">
                      <h3 className="text-[#474653] text-[11px] sm:text-xs md:text-sm font-medium truncate">
                        {card.name}
                      </h3>
                      <span className="text-[#474653] text-[9px] sm:text-[10px] md:text-xs font-medium whitespace-nowrap">
                        {card.weight}
                      </span>
                    </div>
                    <p className="text-right text-[#474653]/70 text-[9px] sm:text-[10px] md:text-sm font-medium">
                      {card.origin}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <Link to={`/coffee_beans/${card.id}`}>
                    <div className="relative w-full h-7 sm:h-9 md:h-11 lg:h-12 bg-[#474653] rounded-full overflow-hidden cursor-pointer group transition-all duration-300 hover:bg-[#5a5a6b]">
                      <div className="absolute w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 left-0 top-1/2 -translate-y-1/2 bg-[#ADADAD] rounded-full blur-2xl opacity-30"></div>
                      <span className="absolute left-1.5 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 text-[#F7D5A0] text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold">
                        {card.price}
                      </span>
                      <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[#F7D5A0] text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold whitespace-nowrap">
                        Add to cart
                      </span>
                      <div className="absolute right-0.5 sm:right-1 md:right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-[#F7D5A0] rounded-full flex items-center justify-center group-hover:bg-[#e8c48a] transition-colors">
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="sm:w-2.5 sm:h-2.5 md:w-3 md:h-3"
                        >
                          <path
                            d="M7 2v10M2 7h10"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional: Pagination Indicators */}
        {coffeeCards.length > cardsPerView && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({
              length: Math.ceil(coffeeCards.length / cardsPerView),
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * cardsPerView)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / cardsPerView) === idx
                    ? "w-6 bg-[#474653]"
                    : "w-1.5 bg-[#474653]/30 hover:bg-[#474653]/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Marquee/Ticker Patch - Full width */}
      <div className="absolute bottom-5 left-0 right-0 z-0 overflow-hidden backdrop-blur-sm py-2 sm:py-3">
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 sm:gap-2 mx-4 sm:mx-6 text-xs sm:text-base lg:text-lg font-semibold"
            >
              <img
                src={canada_flag}
                alt="canadian flag"
                className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
              />
              <span className="text-[10px] sm:text-sm lg:text-[20px] font-bold text-[#0f0f0f80]">
                100% Canadian Owned Business
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignatureCoffee;
