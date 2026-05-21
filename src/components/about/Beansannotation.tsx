// components/about/BeansAnnotation.tsx
import { useRef } from "react";
import type { RefObject } from "react";
import { motion, useInView } from "framer-motion";
import bean_center from "../../assets/images/img_08.svg";
import img_top from "../../assets/images/img_10.svg";
import img_left from "../../assets/images/img_09.svg";
import img_right from "../../assets/images/img_11.svg";

interface BeansAnnotationProps {
  beanCenterRef?: RefObject<HTMLDivElement | null>; // ← null-safe
}

const BeansAnnotation = ({ beanCenterRef }: BeansAnnotationProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <div
      ref={sectionRef}
      className="relative w-full flex-1 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] mt-2"
    >
      {/* big bean — beanCenterRef attached here ── */}
      <div
        ref={beanCenterRef as RefObject<HTMLDivElement>}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
      </div>

      {/* ── TOP ── */}
      <motion.div
        className="absolute top-[12%] sm:top-[22%] md:top-[14%] lg:top-[10%] xl:top-[-4%] 2xl:top-[4%]
          left-[40%] sm:left-[40%] lg:left-[46%] xl:left-[44%] 2xl:left-[40%] z-0 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="hidden sm:block">
          <img
            src={img_top}
            alt=""
            className="w-[50vw] sm:w-[35vw] xl:w-[22vw] 2xl:w-[25vw]"
          />
        </div>
        <p className="block sm:hidden text-[#F7D5A0] text-[12px] text-start w-[30vh]">
          Roasted in Small Batches to ensure consistent flavour profile
        </p>
      </motion.div>

      {/* ── LEFT ── */}
      <motion.div
        className="absolute top-[40%] sm:top-[45%] md:top-[45%] lg:top-[45%] xl:top-[40%] 2xl:top-[36%]
          left-[5%] sm:left-[0%] md:left-[0%] lg:left-[2%] xl:left-[12%] 2xl:left-[4%] z-0 pointer-events-none"
        initial={{ x: -150, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -150, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <div className="hidden sm:block">
          <img
            src={img_left}
            alt=""
            className="w-[50vw] sm:w-[35vw] xl:w-[24vw] 2xl:w-[25vw]"
          />
        </div>
        <p className="block sm:hidden text-[#F7D5A0] text-[12px] text-start w-[15vh]">
          Roasted in Small Batches to ensure consistent flavour profile
        </p>
      </motion.div>

      {/* ── RIGHT ── */}
      <motion.div
        className="absolute top-[46%] sm:bottom-[16%] md:bottom-[20%] lg:bottom-[20%] xl:bottom-[30%] 2xl:bottom-[50%]
          right-[2%] sm:right-[0%] md:right-[8%] lg:right-[4%] xl:right-[16%] 2xl:right-[14%] -translate-y-1/2 z-0 pointer-events-none"
        initial={{ x: 150, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: 150, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className="hidden sm:block">
          <img
            src={img_right}
            alt=""
            className="w-[50vw] sm:w-[35vw] xl:w-[24vw] 2xl:w-[25vw]"
          />
        </div>
        <p className="block sm:hidden text-[#F7D5A0] text-[12px] text-end w-[15vh]">
          Roasted in Small Batches to ensure consistent flavour profile
        </p>
      </motion.div>
    </div>
  );
};

export { BeansAnnotation };
export default BeansAnnotation;
