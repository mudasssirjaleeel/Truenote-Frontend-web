import Header from "@/components/layout/Header";

import img_01 from "../assets/images/img_31.png";
import img_02 from "../assets/images/img_32.png";
import img_03 from "../assets/images/img_33.png";
import img_04 from "../assets/images/img_34.png";
import img_05 from "../assets/images/img_13.svg";
import img_svg from "../assets/svgs/counter.svg";
import { Link } from "react-router-dom";

// ── Types ────────────────────────────────────────────────────────────────────
interface BrewCard {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface BrewStep {
  number: number;
  title: string;
  paragraphs: { heading?: string; body: string }[];
  active?: boolean;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const brewCards: BrewCard[] = [
  {
    title: "Hario V60",
    description:
      "A balanced brewing method that delivers smooth and consistent flavors.",
    image: img_01,
    url: 'hario-v60' 
  },
  {
    title: "Kalita Wave",
    description:
      "A pour-over method known for its clean, bright, and aromatic cup.",
    image: img_02,
    url: 'kalita-wave'  
  },
  {
    title: "Chemex",
    description:
      "A hybrid brewing method combining immersion and filtration for rich, full-bodied coffee.",
    image: img_03,
    url: 'chemex'  
  },
  {
    title: "Clever Dripper",
    description: "Produces a clean and delicate cup with clarity and elegance.",
    image: img_04,
    url: 'clever-dripper'  
  },
];

const brewSteps: BrewStep[] = [
  {
    number: 1,
    title: "Always use fresh beans",
    active: true,
    paragraphs: [
      {
        heading:
          "You know that magical aroma of freshly brewed coffee? It starts with fresh beans—but there's a little science (and patience!) involved to make it shine. Let's break it down:",
        body: "When coffee beans are roasted, they're like tiny flavor volcanoes holding onto CO₂ gas (a natural byproduct of roasting). This trapped gas needs time to escape, a process called degassing—and brewing too soon can lead to a sour or uneven taste. Think of it like letting a cake cool before frosting; timing is everything!",
      },
      {
        heading: "Here's your freshness cheat sheet:",
        body: "Wait 2–2.5 weeks post-roast for most beans to finish degassing. Check the bag's roast date!\nPeak flavor window hits around 2.5–5 weeks after roasting. This is when your beans are singing with balanced, vibrant notes\nGrind fresh every time! Pre-ground beans lose their magic fast. Grind just before brewing for maximum flavor.",
      },
    ],
  },
  {
    number: 2,
    title: "Let's Talk Temperature & Recipes: Your Secret to Coffee Magic",
    paragraphs: [
      {
        body: "Brewing a stellar cup of coffee isn't just about hot water—it's about the right kind of hot. Think of it like Goldilocks: not too scalding, not too lukewarm, but just right. Here's the sweet spot for Ideal Brew Temp: 91°C–94°C (196°F–201°F). Having a temperature controlled gooseneck kettle will come in very handy.",
      },
    ],
  },
  {
    number: 3,
    title: "The Coffee-to-Water Ratio",
    paragraphs: [
      {
        body: "This is where you get to play! Coffee to Water ratios are usually in the 1:15 to 1:18 ratio. So, for example, to brew 20 gms of coffee in 1:16 ratio, we will use 320 ml water. Keep a gram scale to measure bean weight and water volume.",
      },
      {
        heading: "Pro Tips for Brewing",
        body: "Take notes: Track what works! (\"July 5: 1:17 ratio + 93°C = heavenly caramel vibes.\")\nPatience pays: Let your recipe shine fully before tweaking.\nEmbrace the ritual: Brewing's not just science—it's your morning meditation.",
      },
    ],
  },
  {
    number: 4,
    title: "Grind Size",
    active: false,
    paragraphs: [
      {
        body: "Brewing a stellar cup of coffee isn't just about hot water—it's about the right kind of hot. Think of it like Goldilocks: not too scalding, not too lukewarm, but just right. Here's the sweet spot for Ideal Brew Temp: 91°C–94°C (196°F–201°F). Having a temperature controlled gooseneck kettle will come in very handy.",
      },
    ],
  },
];

// ── Arrow icon ───────────────────────────────────────────────────────────────
const ArrowIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 7L7 1M7 1H2M7 1V6"
      stroke="#474653"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Brew Card ────────────────────────────────────────────────────────────────
const BrewCardItem = ({ card }: { card: BrewCard }) => (
  <div className="relative  h-[340px] sm:h-[380px] lg:h-[409px] flex-shrink-0 bg-[#F0DAC4] overflow-hidden flex flex-col justify-end">
    <img
      src={card.image}
      alt={card.title}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div
      className="relative z-10 p-4 lg:p-6 flex flex-col gap-2"
      style={{
        background: "rgba(51,51,51,0.20)",
        backdropFilter: "blur(13px)",
      }}
    >
      <h3
        className="text-[#F7D5A0] text-lg lg:text-2xl font-semibold leading-6"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        {card.title}
      </h3>
      <div className="flex items-end justify-between gap-3">
        <p
          className="text-[#F7D5A0] text-xs lg:text-sm font-medium leading-5 flex-1"
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          {card.description}
        </p>
        <button
          className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: "#F7D5A0" }}
        >
          <ArrowIcon />
        </button>
      </div>
    </div>
  </div>
);

// ── Brew Step ────────────────────────────────────────────────────────────────
const BrewStepItem = ({
  step,
  isLast,
}: {
  step: BrewStep;
  isLast: boolean;
}) => (
  <div className="flex flex-col items-start">
    {/* on mobile: stack vertically with badge on top; lg+: side by side */}
    <div
      className="flex flex-col sm:flex-row items-start w-full mb-4"
      style={{ borderRadius: "0 16px 16px 16px" }}
    >
      {/* Badge column — on mobile: full-width row with just the badge; lg+: svg + badge */}
      <div
        className="flex sm:flex-col items-center sm:items-start flex-shrink-0 mb-3 sm:mb-0"
        style={{ width: "auto" }}
      >
        {/* Mobile — just the number badge inline */}
        <div
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full mr-4"
          style={{
            background: "#F2D1B2",
            border: "1px solid #474653",
            flexShrink: 0,
          }}
        >
          <span
            className="text-base leading-none"
            style={{
              fontFamily: "'League Spartan', sans-serif",
              color: "#474653",
              opacity: step.active === false ? 0.4 : 1,
            }}
          >
            {step.number}
          </span>
        </div>

        {/* lg+ — SVG shape with badge overlaid */}
        <div
          className="relative hidden sm:block flex-shrink-0"
          style={{ width: 80 }}
        >
          <img
            src={img_svg}
            alt=""
            className="w-full block"
            style={{ display: "block" }}
          />
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10"
            style={{ background: "#F2D1B2", border: "1px solid #474653" }}
          >
            <span
              className="text-base leading-none"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                color: "#474653",
                opacity: step.active === false ? 0.4 : 1,
              }}
            >
              {step.number}
            </span>
          </div>
        </div>
      </div>

      {/* Content box */}
      <div
        className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col gap-3 lg:gap-4 w-full"
        style={{ background: "#F2D1B2", borderRadius: "0 16px 16px 16px" }}
      >
        <h3
          className="text-[#474653] text-lg sm:text-xl lg:text-2xl font-bold leading-tight"
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          {step.title}
        </h3>

        <div className="flex flex-col gap-3">
          {step.paragraphs.map((para, i) => (
            <div key={i} className="flex flex-col gap-1">
              {para.heading && (
                <p
                  className="text-[rgba(71,70,83,0.80)] text-sm lg:text-base font-semibold leading-6"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {para.heading}
                </p>
              )}
              {para.body.includes("\n") ? (
                <ul className="flex flex-col gap-1 pl-1">
                  {para.body
                    .split("\n")
                    .filter(Boolean)
                    .map((line, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[rgba(71,70,83,0.90)] text-sm lg:text-base font-normal leading-6"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                      >
                        <span className="mt-[10px] w-[5px] h-[5px] rounded-full bg-[#474653] flex-shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p
                  className="text-[rgba(71,70,83,0.90)] text-sm lg:text-base font-normal leading-6"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {para.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Connector */}
    {!isLast && <div className="w-[80px] h-[48px] sm:h-[60px] flex-shrink-0" />}
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const BrewGuidePage = () => {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#E2C4A7" }}
    >
      <Header />

      {/* glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 1598,
          height: 856,
          left: -79,
          top: -557,
          background: "rgba(255,255,255,0.50)",
          borderRadius: 9999,
          filter: "blur(216px)",
        }}
      />

      {/* ── HERO ── */}
      <div className="relative w-full px-5 sm:px-10 lg:px-20 pt-[100px] sm:pt-[120px] lg:pt-[168px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-0">
          <div className="flex flex-col gap-4 lg:gap-6 max-w-full lg:max-w-[55%]">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#474653] leading-tight"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Brew Better Coffee at Home
            </h1>
            <p
              className="font-semibold leading-7 lg:leading-8"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                color: "rgba(71,70,83,0.80)",
                fontSize: "clamp(1rem, 2vw, 1.5rem)",
                maxWidth: 409,
              }}
            >
              Master the art of brewing and unlock the full flavor of specialty
              coffee with our simple step-by-step guides.
            </p>
          </div>

          {/* Decorative right image — hidden on small, shown lg+ */}
          <img
            src={img_05}
            alt=""
            className="hidden lg:block flex-shrink-0"
            style={{ width: 300, height: 409, objectFit: "cover" }}
          />
        </div>

        {/* Cards — horizontal scroll on all screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[22px] mt-10 lg:mt-[40px]">
  {brewCards.map((card, i) => (
    <Link
      to={`/brew_guide/${card.url}`}  // This will create: /brew_guide/hario-v60, /brew_guide/kalita-wave, etc.
      className="w-full"
      key={i}
    >
      <BrewCardItem card={card} />
    </Link>
  ))}
</div>
      </div>

      {/* ── BASICS OF BREWING ── */}
      <div className="relative w-full px-5 sm:px-10 lg:px-20 mt-12 lg:mt-[80px] pb-10 lg:pb-0">
        <div className="max-w-[1298px] mx-auto flex flex-col items-center gap-8 lg:gap-10">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#474653] md:text-center"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Basics of Brewing
          </h2>

          <div className="w-full flex flex-col gap-0 mb-10">
            {brewSteps.map((step, index) => (
              <BrewStepItem
                key={step.number}
                step={step}
                isLast={index === brewSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrewGuidePage;