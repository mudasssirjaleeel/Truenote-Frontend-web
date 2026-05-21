import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBeans } from "@/hooks/useBeans";
import pack_01 from "../../assets/images/pack_01.svg";
import { getImageUrl, getImageUrlFromObject } from '@/utils/imageUrl';


interface CardData {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: string;
  origin?: string;
  weight?: number;
}




 

function CoffeeCard({ card }: { card: CardData }) {
  return (
    <div
      style={{
        padding: 12,
        background: "rgba(240, 209, 178, 0.15)",
        borderRadius: 20,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(240, 209, 178, 0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: "100%",
        boxSizing: "border-box" as const,
        
      }}
    >
      <img
        style={{
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: 14,
          objectFit: "cover" as const,
        }}
        className="" 
        src={card.image || pack_01}
        alt={card.title}
        onError={(e) => {
          (e.target as HTMLImageElement).src = pack_01;
        }}
      />
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            color: "#F7D5A0",
            fontSize: 14,
            fontFamily: "League Spartan, sans-serif",
            fontWeight: 600,
          }}
        >
          {card.title}
        </span>
        <span
          style={{
            color: "rgba(247, 213, 160, 0.75)",
            fontSize: 12,
            fontFamily: "League Spartan, sans-serif",
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {card.description}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 44,
          position: "relative",
          background: "#474653",
          overflow: "hidden",
          borderRadius: 75,
          cursor: "pointer",
          boxSizing: "border-box" as const,
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            left: -10,
            top: 10,
            position: "absolute",
            background: "#888",
            borderRadius: 9999,
            filter: "blur(30px)",
            opacity: 0.3,
            pointerEvents: "none" as const,
          }}
        />
        <span
          style={{
            position: "absolute",
            left: 12,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            color: "#F7D5A0",
            fontSize: 13,
            fontFamily: "League Spartan, sans-serif",
            fontWeight: 700,
          }}
        >
          {card.price}
        </span>
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            color: "#F7D5A0",
            fontSize: 12,
            fontFamily: "League Spartan, sans-serif",
            fontWeight: 600,
            whiteSpace: "nowrap" as const,
          }}
        >
          Add to cart
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#F7D5A0",
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2v10M2 7h10"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function SwappingCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const { beans, loading, getBeans } = useBeans(false);

  // Fetch beans on mount
  useEffect(() => {
    getBeans({ limit: 20 });
  }, []);

  // Transform API data to card format
  useEffect(() => {
    if (beans && beans.length > 0) {
      const transformedCards: CardData[] = beans.map((bean) => ({
        id: bean.id,
        title: bean.name,
        description: bean.description || `${bean.origin} · ${bean.weight}g`,
        price: `$${Number(bean.price).toFixed(2)}`,
        image: getImageUrl(bean.imageUrl),
        origin: bean.origin,
        weight: bean.weight,
      }));
      setAllCards(transformedCards);
      setCurrentIndex(0);
      setNextIndex(1);
    }
  }, [beans]);

  // Auto-rotate cards
  useEffect(() => {
    if (allCards.length === 0) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);

        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setNextIndex((nextIndex + 1) % allCards.length);

          setTimeout(() => {
            setIsAnimating(false);
          }, 100);
        }, 600);
      }
    }, 3600);

    return () => clearInterval(interval);
  }, [isAnimating, nextIndex, allCards.length]);

  // Loading state
  if (loading && allCards.length === 0) {
    return (
      <div className="w-[300px] md:w-[240px] lg:w-[260px] relative justify-center " style={{ transform: "translateY(-20%)" }}>
        <div
          style={{
            padding: 12,
            background: "rgba(240, 209, 178, 0.15)",
            borderRadius: 20,
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(240, 209, 178, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: 14,
              background: "rgba(247, 213, 160, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="w-8 h-8 border-2 border-[#F7D5A0] border-t-transparent rounded-full animate-spin" />
          </div>
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div className="h-4 bg-[#F7D5A0]/20 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-[#F7D5A0]/10 rounded w-full animate-pulse" />
            <div className="h-3 bg-[#F7D5A0]/10 rounded w-5/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (allCards.length === 0) {
    return (
      <div className="w-[300px] md:w-[240px] lg:w-[260px] relative justify-center" style={{ transform: "translateY(-20%)" }}>
        <div
          style={{
            padding: 12,
            background: "rgba(240, 209, 178, 0.15)",
            borderRadius: 20,
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(240, 209, 178, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: "100%",
          }}
        >
          <span style={{ color: "#F7D5A0", fontSize: 14, textAlign: "center" }}>
            No coffee available
          </span>
        </div>
      </div>
    );
  }

  const currentCard = allCards[currentIndex];
  const nextCard = allCards[nextIndex];

  return (
    <div className="w-auto md:w-[240px] lg:w-[260px] relative justify-center -translate-y-1/16  lg:-translate-y-1/9" >
      {/* This invisible div maintains the height */}
      <div style={{ visibility: "hidden" }}>
        <CoffeeCard card={allCards[0]} />
      </div>

      {/* Next Card - Coming from bottom */}
      <motion.div
        key={`next-${nextCard?.id || "next"}`}
        initial={{ y: 0, opacity: 0 }}
        animate={{
          y: isAnimating ? 0 : 160,
          opacity: isAnimating ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: isAnimating ? 20 : 10,
        }}
      >
        {nextCard && <CoffeeCard card={nextCard} />}
      </motion.div>

      {/* Current Card - Moving up */}
      <motion.div
        key={`current-${currentCard?.id || "current"}`}
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isAnimating ? -60 : 0,
          opacity: isAnimating ? 0 : 1,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 30,
        }}
      >
        {currentCard && <CoffeeCard card={currentCard} />}
      </motion.div>
    </div>
  );
}