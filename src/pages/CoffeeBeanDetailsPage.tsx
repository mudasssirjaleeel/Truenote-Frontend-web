import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useBeans } from "@/hooks/useBeans";
import Header from "@/components/layout/Header";
import pack_01 from "../assets/images/pack_01.svg";
import wave from "../assets/svgs/wave_ong.png";
import bg_img from "../assets/images/img_28.svg";
import heart_img from "../assets/images/img_29.svg";
import heart_img1 from "../assets/images/img_30.png";
import ctaBgVideo from "../assets/videos/hero_bg.mp4";
import { ArrowRightIcon } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { getImageUrl, getImageUrlFromObject } from "@/utils/imageUrl";

interface BeanDetails {
  id: string;
  name: string;
  origin: string;
  roastLevel: string;
  flavorNotes: string;
  process: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  imageUrls: string[];
  price: number;
  weight: number;
  isDark: boolean;
}

const CoffeeBeanDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBeanById } = useBeans(false);
  const [bean, setBean] = useState<BeanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const {
    wishlist,
    addItem,
    removeItem,
    isInWishlist: checkInWishlist,
  } = useWishlist();

  const isInWishlist = checkInWishlist("bean", bean?.id || "");

  const { addItem: addToCart, loading: cartLoading } = useCart();

  const handleAddToCart = async () => {
    if (!bean) return;

    await addToCart({
      type: "bean",
      beanId: bean.id,
      quantity: quantity,
      grindId: null, // Pass grind ID if selected
      planId: null, // Pass plan ID if selected
    });
  };

  const handleWishlistToggle = async () => {
    if (!bean) return;

    setWishlistLoading(true);

    if (isInWishlist) {
      // Get wishlist item ID and remove
      const wishlistItem = wishlist.find(
        (item) => item.type === "bean" && item.id === bean.id,
      );
      if (wishlistItem) {
        await removeItem(wishlistItem.wishlistId);
      }
    } else {
      // Add to wishlist
      await addItem({
        type: "bean",
        beanId: bean.id,
      });
    }

    setWishlistLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchBeanDetails();
    }
  }, [id]);

  const fetchBeanDetails = async () => {
    setLoading(true);
    try {
      const result = await getBeanById(id!);
      if (result && result.payload) {
        const beanData = (result.payload as any).data;
        const transformedBean: BeanDetails = {
          id: beanData.id,
          name: beanData.name,
          origin: beanData.origin,
          roastLevel: beanData.isDark ? "Dark" : "Light",
          flavorNotes:
            beanData.description?.split(",").slice(0, 3).join(", ") ||
            "Citrus, Floral, Honey",
          process: "Washed",
          description:
            beanData.description ||
            `Sourced from the highlands of ${beanData.origin}, this single-origin coffee delivers a vibrant and complex cup.`,
          longDescription:
            beanData.description ||
            `Sourced from the highlands of ${beanData.origin}, this single-origin coffee delivers a vibrant and complex cup. Expect delicate floral aromas, citrus brightness, and a smooth, tea-like body—perfect for pour-over and filter brewing.`,
          imageUrl: getImageUrl(beanData.imageUrl) || pack_01,
          imageUrls: beanData.imageUrls?.map((url: string) =>
            getImageUrl(url),
          ) || [getImageUrl(beanData.imageUrl) || pack_01],
          price: Number(beanData.price),
          weight: beanData.weight,
          isDark: beanData.isDark,
        };
        setBean(transformedBean);
        setSelectedImage(transformedBean.imageUrl);
      }
    } catch (error) {
      console.error("Error fetching bean details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8DBBD]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#474653] border-r-transparent"></div>
            <p className="mt-4 text-[#474653]">Loading coffee details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bean) {
    return (
      <div className="min-h-screen bg-[#F8DBBD]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-[#474653] text-xl">Coffee bean not found</p>
            <Link
              to="/"
              className="mt-4 inline-block text-[#E19D5E] hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8DBBD]">
      <Header />

      <div className="w-full">
        {/* FIRST SECTION - Sticky Hero Section with Full Screen Background */}
        <div className="relative w-full h-screen overflow-hidden sticky top-0 z-0">
          {/* Full Screen Background Image */}
          <img
            src={bg_img}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Bean Name */}
          <p
            className="absolute pt-20 sm:pt-0 sm:top-[28%] md:top-[30%] left-0 md:left-1/2 px-4 sm:px-5 md:px-0 text-center w-full md:-translate-x-1/2 
    text-[38px] sm:text-[35px] md:text-[45px] lg:text-[60px] xl:text-[70px] 2xl:text-[90px] font-bold z-20"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #F8DBBD",
              textStroke: "2px #474653",
            }}
          >
            {bean.name}
          </p>

          {/* Bean Description */}
          <div className="absolute pt-50 sm:pt-0 sm:top-[40%] md:top-[42%] lg:top-[44%] left-0 right-0 px-4 sm:px-5 md:px-0">
            <span className="block text-[30px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[25px] 2xl:text-[30px] font-medium text-[#F8DBBD] z-20 text-center">
              {bean.description}
            </span>
          </div>
        </div>

        {/* SECOND SECTION - Product Details (Scrollable with solid background) */}
        <div className="relative z-10 bg-[#F8DBBD]  top-[-20%]">
          {/* Full Width Wave Image at Top */}
          <div className="absolute top-[-10%] lg:top-[-20%] left-0 w-full z-0">
            <img
              src={wave}
              alt="Wave"
              className="w-full h-[200px] hidden md:block "
            />
            <div className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 w-[37px] h-[61px] rounded-[21.75px] border-4 border-[#F8DBBD] hidden lg:block" />
          </div>

          <div className="w-full py-12 lg:py-[50px] px-5 md:px-10 xl:px-40 2xl:px-60">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Left Side - Images with Overlay Thumbnails */}
              <div className="flex-1 relative bg-[#E0C2A2] rounded-2xl overflow-hidden px-20 lg:max-w-[600px] min-h-[450px] lg:min-h-[650px]">
                {/* Background Blur Effects */}
                <div className="absolute w-[601px] h-[601px] left-[502px] -top-[226px] bg-[#BA7A7A] rounded-full blur-[181px] opacity-50 z-20" />
                <div className="absolute w-[601px] h-[601px] -left-[266px] top-[602px] bg-[#C37777] rounded-full blur-[181px] opacity-50 z-20" />

                {/* Main Image as Background */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${selectedImage})` }}
                />

                {/* Thumbnail Images - Overlay at bottom */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-start gap-3 lg:gap-4 px-6 z-20">
                  {bean.imageUrls.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shadow-lg ${
                        selectedImage === img
                          ? "ring-2 ring-[#F7D5A0] scale-105"
                          : "ring-1 ring-white/30 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${bean.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = pack_01;
                        }}
                      />
                      {selectedImage === img && (
                        <div className="absolute inset-0 bg-black/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="flex-1 flex flex-col gap-4 lg:gap-6">
                {/* Title Section */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h1
                      className="text-[#333333] text-2xl lg:text-4xl font-medium mb-2 lg:mb-4"
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      {bean.name}
                    </h1>
                    <p
                      className="text-[#333333]/70 text-base lg:text-2xl font-normal"
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      {bean.description}
                    </p>
                  </div>

                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={() => handleWishlistToggle()}
                    disabled={wishlistLoading}
                    className="w-8 h-8 lg:w-[38px] lg:h-[40px] cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img
                      src={isInWishlist ? heart_img1 : heart_img}
                      alt={
                        isInWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      className="w-full h-full object-contain"
                    />
                  </button>
                </div>

                {/* Rest of your content remains the same */}
                {/* Short Description */}
                <p
                  className="text-[#333333]/90 text-sm lg:text-lg font-medium leading-6"
                  style={{ fontFamily: "League Spartan, sans-serif" }}
                >
                  {bean.longDescription.substring(0, 200)}...
                </p>

                {/* Long Description */}
                <p
                  className="text-[#333333]/90 text-sm lg:text-base font-normal leading-6 line-clamp-4 lg:line-clamp-none"
                  style={{ fontFamily: "League Spartan, sans-serif" }}
                >
                  {bean.longDescription}
                </p>

                {/* Details Grid */}
                <div className="flex gap-8 lg:gap-10 mt-4">
                  <div className="flex flex-col gap-4 lg:gap-6">
                    <span
                      className="text-[#333333]/50 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      Origin :
                    </span>
                    <span
                      className="text-[#333333]/50 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      Roast Level :
                    </span>
                    <span
                      className="text-[#333333]/50 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      Flavor Notes :
                    </span>
                    <span
                      className="text-[#333333]/50 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      Process :
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 lg:gap-6">
                    <span
                      className="text-[#333333]/70 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      {bean.origin}
                    </span>
                    <span
                      className="text-[#333333]/70 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      {bean.roastLevel}
                    </span>
                    <span
                      className="text-[#333333]/70 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      {bean.flavorNotes}
                    </span>
                    <span
                      className="text-[#333333]/70 text-base lg:text-[18px] font-semibold "
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      {bean.process}
                    </span>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 mt-6 lg:mt-8">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 lg:gap-4">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      className="w-10 h-10 lg:w-[43px] lg:h-[43px] flex items-center justify-center rounded-2xl border border-[#333333] hover:bg-[#333333]/10 transition-colors cursor-pointer"
                    >
                      <span className="text-2xl font-medium text-[#333333]">
                        -
                      </span>
                    </button>
                    <div className="w-14 h-12 lg:w-[47px] lg:h-[47px] flex items-center justify-center rounded-[20px] border-2 border-[#333333]/50">
                      <span className="text-xl lg:text-2xl font-medium text-[#333333]">
                        {quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="w-10 h-10 lg:w-[43px] lg:h-[43px] flex items-center justify-center rounded-2xl border border-[#333333] hover:bg-[#333333]/10 transition-colors cursor-pointer"
                    >
                      <span className="text-2xl font-medium text-[#333333]">
                        +
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart()}
                    disabled={cartLoading}
                    className="w-full lg:w-[313px] h-14 lg:h-[62px] px-4 lg:px-4 bg-[#474653] rounded-[75px] flex items-center justify-between hover:bg-[#5a5a6b] transition-colors group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span
                      className="text-[#F7D5A0] text-[16px] lg:text-[20px] font-semibold"
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      ${(bean.price * quantity).toFixed(2)}
                    </span>
                    <span
                      className="text-[#F7D5A0] text-[16px] lg:text-[20px] font-semibold"
                      style={{ fontFamily: "League Spartan, sans-serif" }}
                    >
                      {cartLoading ? "Adding..." : "Add to cart"}
                    </span>
                    <div className="w-8 h-8 lg:w-[42px] lg:h-[42px] bg-[#F7D5A0] rounded-full flex items-center justify-center group-hover:bg-[#e8c48a] transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M7 2v10M2 7h10"
                          stroke="#333"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section with Video */}
        <div className="relative w-full overflow-hidden lg:mb-20 h-[420px] sm:h-[480px] lg:h-[777px]">
          {/* bg video */}
          <video
            autoPlay
            loop
            muted
            playsInline
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
                From bold and intense to smooth and aromatic{" "}
                <br className="hidden md:block" /> — explore flavors crafted for
                every moment.
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
                  <ArrowRightIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeBeanDetailsPage;