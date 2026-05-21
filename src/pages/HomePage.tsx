import HeroSection from "@/components/home/HeroSection";
import RoastedCoffee from "@/components/home/RoastedCoffee";
import SignatureCoffee from "@/components/home/SignatureCoffee";
import Header from "@/components/layout/Header";

import coffeeShop from "../assets/images/coffee_shop.svg";
import coffeeImg from "../assets/images/cup_in_hand.svg";
import { useEffect, useRef, useState } from "react";

const HomePage = () => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

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
    <div className="relative">
      {/* Sticky Header - overlays on top of content */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Main Content - no padding, header overlays naturally */}
      <div>
        <div id="hero">
          <HeroSection />
        </div>
        <SignatureCoffee />
       
        <RoastedCoffee />

        <section ref={sectionRef} className="relative w-full h-screen overflow-hidden py-10">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={coffeeShop}
              alt="Background"
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top Navigation (optional) */}
            <div className="pt-6 px-6 sm:px-12 lg:px-20">
              {/* Add your logo/navigation here if needed */}
            </div>

            {/* Main Content - Centered vertically */}
            <div className="flex-1 flex items-center">
              <div className="w-full">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 lg:gap-12">
                  {/* Left Side - Text Content - Animates from top to bottom */}
                  <div 
                    className="flex-1 text-center lg:text-left lg:ps-16 transition-all duration-1000 ease-out"
                    style={{
                      transform: isInView ? 'translateY(0)' : 'translateY(-80px)',
                      opacity: isInView ? 1 : 0,
                      transitionDelay: hasAnimated ? '200ms' : '0ms'
                    }}
                  >
                    <h1 className="text-[#F7D5A0] px-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight mb-4">
                      Find Your Perfect Cup at <br className="hidden sm:block" />
                      Truenote Specialty Cafe
                    </h1>
                  </div>

                  {/* Right Side - Image with scale animation at bottom end */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      marginBottom: '-30px',
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: hasAnimated ? '400ms' : '0ms'
                    }}
                  >
                    <img
                      src={coffeeImg}
                      alt="Coffee Cup"
                      style={{ 
                        objectFit: 'contain',
                        transition: 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isInView ? 'scale(1.2)' : 'scale(1)',
                      }}
                      className="h-[400px] me-[-0px] mb-[-20px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;