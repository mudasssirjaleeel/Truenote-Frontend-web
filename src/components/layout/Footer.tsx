import { Link } from "react-router-dom";
import logo from "../../assets/header_logo.png";
import footer_1 from "../../assets/svgs/footer_1.svg";
import linkedin from "../../assets/social_icons/linkedin.svg";
import instagram from "../../assets/social_icons/instagram.svg";
import tiktok from "../../assets/social_icons/tiktok.svg";

export default function Footer() {
  return (
    <footer className="relative text-gray-300 z-50 bg-[#474653]">
      {/* Background Image - Only visible on LG screens and above */}
      <div className="absolute bottom-0 right-0 left-0 pointer-events-none z-0 hidden lg:block">
        <img src={footer_1} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Footer Content - Responsive Flex Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Left Side - Social Icons */}
          <div className="flex items-center gap-3 order-1 md:order-1">
            <a
              href="#"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-amber-600 flex items-center justify-center transition-colors"
            >
              <img src={linkedin} alt="LinkedIn" className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-amber-600 flex items-center justify-center transition-colors"
            >
              <img src={instagram} alt="Instagram" className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-amber-600 flex items-center justify-center transition-colors"
            >
              <img src={tiktok} alt="TikTok" className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="order-3 md:order-2 w-full md:w-auto">
            <p className="text-xs sm:text-sm md:text-[16px] text-[#F7D5A080] text-center">
              © {new Date().getFullYear()} Truenote Coffee Co. All rights
              reserved.
            </p>
          </div>

          {/* Privacy Policy & Terms of Service */}
          <div className="order-2 md:order-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <Link
              to="/privacy"
              className="text-xs sm:text-sm md:text-[16px] text-[#F7D5A080] hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs sm:text-sm md:text-[16px] text-[#F7D5A080] hover:text-amber-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Right End - Logo */}
          <div className="order-4 md:order-4">
            <img src={logo} alt="Truenote" className="w-24 sm:w-28 md:w-32 lg:w-40" />
          </div>
        </div>
      </div>
    </footer>
  );
}