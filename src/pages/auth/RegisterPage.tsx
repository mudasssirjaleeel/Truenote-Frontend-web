import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

import bottom_left_img from "../../assets/images/svg-1.svg";
import cup_image from "../../assets/images/coffee_cup.png";
import bean_blur from "../../assets/images/bean_blur.png";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully!");
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden pt-24 sm:pt-28 lg:pt-30"
      style={{ background: "linear-gradient(110deg, #E2C4A7 0%, #FDF6F0 100%)" }}
    >
      {/* Background Image - Bottom Left Corner */}
      <div className="absolute bottom-0 left-0 pointer-events-none z-0">
        <img
          src={bottom_left_img}
          alt=""
           className="w-[120px] sm:w-[360px] lg:w-[600px] XL:w-[680px] block"
        />
      </div>

      {/* Left Column — hidden on mobile, visible lg+ */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative z-10">
        <div className="px-12 lg:px-16 xl:px-20 pt-12">
          <div className="max-w-md">
            <h1 className="text-[24px] 2xl:text-[32px] font-bold text-[#474653] mb-4">
              Create Your Truenote Account
            </h1>
            <p
              className="text-[20px] font-semibold leading-relaxed"
              style={{ color: "rgba(71, 70, 83, 0.70)" }}
            >
              Join Truenote Coffee to order faster, save your favorite drinks, and stay updated on new coffee beans and special offers.
            </p>
            <div className="flex justify-center">
              <img src={cup_image} alt="" className="w-60" />
            </div>
          </div>
        </div>

        {/* Bean blur image at bottom end */}
        <div className="flex justify-start px-12 lg:px-16 xl:px-20">
          <img src={bean_blur} alt="" className="w-60" />
        </div>
      </div>

      {/* Right Column — Form */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end px-5 sm:px-10 lg:pr-20 py-8 lg:py-10 relative z-10">
        <div className="w-full max-w-md">

          {/* Mobile-only heading */}
          <div className="lg:hidden mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#474653] mb-2">
              Create Your Truenote Account
            </h1>
            <p
              className="text-sm sm:text-base font-semibold leading-relaxed"
              style={{ color: "rgba(71, 70, 83, 0.70)" }}
            >
              Join Truenote Coffee to order faster, save your favorite drinks, and stay updated on new coffee beans and special offers.
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-1 border-gray-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-1 border-gray-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-gray-500 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the Terms & Conditions
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#135CC1] hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-[#33333380]"></div>
              <span className="text-[#333333] text-sm font-medium whitespace-nowrap">
                or continue with
              </span>
              <div className="flex-1 border-t border-[#33333380]"></div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#33333380] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-gray-700 font-medium">Google</span>
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[#135CC1] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}