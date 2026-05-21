import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import logo from "../../assets/header_logo.png";
import logo_black from "../../assets/images/logo_black.svg";
import headerBgImg from "../../assets/svgs/header_1.png";
import headerBgImg1 from "../../assets/svgs/header_2.png";
import translator_icon from "../../assets/images/translator_icon.svg";
import cart_icon from "../../assets/images/cart_icon.svg";
import profile_icon from "../../assets/images/profile_icon.svg";
import NotificationBell from "../common/NotificationBell";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Brew Guides", path: "/brew_guide" },
  { label: "Subscriptions", path: "/subscription" },
  { label: "Coffee Beans", path: "/coffee_beans" },
  { label: "Contact", path: "/contact" },
];

const DefaultAvatar = ({ color }: { color: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" fill={color} />
    <circle cx="16" cy="12" r="4" fill="white" />
    <path
      d="M8 24C8 20.6863 10.6863 18 14 18H18C21.3137 18 24 20.6863 24 24"
      fill="white"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="10" y1="12" x2="21" y2="12" />
  </svg>
);

export default function Header({
  showBgImage = false,
}: {
  showBgImage?: boolean;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAppSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === "/";
  const isLoggedIn = !!token && !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
    setMenuOpen(false);
    setProfileOpen(false);
  }, [dispatch, navigate]);

  const handleProfileClick = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setHeroInView(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);

  const getTextColor = () => {
    if (showBgImage) return "text-[#474653]";
    if (!isHomePage) return "text-[#474653]";
    if (heroInView && !scrolled) return "text-[#F7D5A0]";
    return "text-[#474653]";
  };

  const getHoverColor = () => {
    if (showBgImage) return "hover:text-[#2C2420]";
    if (!isHomePage) return "hover:text-[#2C2420]";
    if (heroInView && !scrolled) return "hover:text-[#c0b8b1]";
    return "hover:text-[#2C2420]";
  };

  const getAvatarBgColor = () => {
    if (showBgImage) return "#474653";
    if (!isHomePage) return "#474653";
    if (heroInView && !scrolled) return "#F7D5A0";
    return "#474653";
  };

  const isDarkMode = showBgImage || !isHomePage || !heroInView || scrolled;

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const NavLink = ({ link }: { link: (typeof NAV_LINKS)[0] }) => (
    <Link
      to={link.path}
      className={`text-sm text-[#F7D5A0] font-medium tracking-wide transition-all duration-200 relative group ${
        isActive(link.path)
          ? `font-semibold ${getTextColor()}`
          : `${getTextColor()} ${getHoverColor()} text-[16px]`
      }`}
    >
      {link.label}
    </Link>
  );

  const MobileNavLink = ({ link }: { link: (typeof NAV_LINKS)[0] }) => (
    <Link
      to={link.path}
      onClick={() => setMenuOpen(false)}
      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive(link.path)
          ? isDarkMode
            ? "bg-[#E2C4A7]/20 text-[#E2C4A7]"
            : "bg-[#F7D5A0]/20 text-[#F7D5A0]"
          : isDarkMode
            ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {link.label}
    </Link>
  );

  return (
    // ── height steps down on smaller screens, image crops from bottom ──
    <header className="fixed top-0 left-0 right-0 z-50  h-[70px] md:h-[100px] xl:h-[120px] 2xl:h-[140px]">
      {/* ── BG image — top-anchored, crops from the bottom on small screens ── */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={headerBgImg}
          alt=""
          aria-hidden="true"
          className="w-full h-full"
          style={{ objectFit: "fill" }}
        />
      </div>

      <div className="block md:hidden  absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={headerBgImg1}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main content — vertically centered inside the header */}
      <div className="relative z-10 h-auto pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Truenote Coffee"
              className="h-6 sm:h-7 lg:h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.path} link={link} />
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3 lg:gap-4">
            {!isLoggedIn ? (
              <Link
                to="/subscription"
                className="hidden md:flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-4 text-sm font-semibold rounded-full transition-all duration-200 shadow-md bg-[#E2C4A7] hover:bg-[#D4B48C] text-[#474653]"
              >
                <span>Coffee Subscription</span>
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Translator Icon */}
                  <button
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      !isHomePage || !heroInView || scrolled
                        ? "text-[#474653] hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={translator_icon}
                      alt="Translator"
                      className="w-5 h-5"
                    />
                  </button>

                  {/* Cart Icon */}
                  <Link
                    to="/cart"
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      !isHomePage || !heroInView || scrolled
                        ? "text-[#474653] hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <img src={cart_icon} alt="Cart" className="w-5 h-5" />
                  </Link>

                  <NotificationBell
                    isDark={!isHomePage || !heroInView || scrolled}
                  />

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                        !isHomePage || !heroInView || scrolled
                          ? "text-[#474653] hover:bg-gray-100"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <img
                        src={profile_icon}
                        alt="Profile"
                        className="w-5 h-5"
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {profileOpen && (
                      <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-2">
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p
                              className="text-sm font-semibold text-gray-900 truncate"
                              style={{
                                fontFamily: "'League Spartan', sans-serif",
                              }}
                            >
                              {user?.name || "User"}
                            </p>
                            <p
                              className="text-xs text-gray-500 truncate mt-0.5"
                              style={{
                                fontFamily: "'League Spartan', sans-serif",
                              }}
                            >
                              {user?.email || ""}
                            </p>
                          </div>

                          {/* Profile Link */}
                          <button
                            onClick={handleProfileClick}
                            className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            style={{
                              fontFamily: "'League Spartan', sans-serif",
                            }}
                          >
                            <ProfileIcon />
                            <span>Your Profile</span>
                          </button>

                          {/* Logout Button */}
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                            style={{
                              fontFamily: "'League Spartan', sans-serif",
                            }}
                          >
                            <LogoutIcon />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-white hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
              <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
              <div className="w-5 h-0.5 bg-current transition-all" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div
            className={`lg:hidden absolute top-full left-0 right-0 px-4 pt-4 pb-4 border-t rounded-b-lg ${
              isDarkMode
                ? "border-gray-200 bg-white/95 backdrop-blur-md"
                : "border-white/20 bg-black/50 backdrop-blur-md"
            }`}
            ref={menuRef}
          >
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <MobileNavLink key={link.path} link={link} />
              ))}
              <Link
                to="/subscription"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-[#E2C4A7] bg-[#E2C4A7]/10 hover:bg-[#E2C4A7]/20"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Coffee Subscription
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
