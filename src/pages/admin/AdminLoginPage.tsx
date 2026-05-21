import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { Lock, Mail, LogIn, Shield, Coffee } from "lucide-react";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user, loading: reduxLoading } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in as admin
  useEffect(() => {
    if (token && (user?.role === "admin" || user?.role === "staff")) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      const loggedInUser = result.user;

      // Allow both admin and staff with permissions
      const hasAccess =
        loggedInUser?.role === "admin" ||
        (loggedInUser?.role === "staff" &&
          loggedInUser?.permissions &&
          loggedInUser.permissions.length > 0);

      if (!hasAccess) {
        toast.error("Access denied. Admin or staff accounts only.");
        setLoading(false);
        return;
      }

      toast.success(
        `Welcome back, ${loggedInUser?.roleName || loggedInUser?.role}!`,
      );
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err?.message || "Invalid credentials";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4 sm:p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Brand Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg mb-4">
            <Coffee className="w-8 h-8 text-stone-900" />
          </div>
          <p className="text-amber-400 text-3xl font-bold tracking-wide">
            Truenote
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-stone-700 p-6 sm:p-8 animate-slide-up">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-white text-lg font-semibold">Admin Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@truenote.com"
                  className="w-full bg-stone-900 border border-stone-600 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-stone-900 border border-stone-600 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || reduxLoading}
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-900 font-semibold rounded-lg py-2.5 text-sm transition-all duration-200 mt-4 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading || reduxLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in as Admin
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-stone-700">
            <p className="text-center text-stone-500 text-xs">
              Secure access for authorized personnel only
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-stone-600 text-xs mt-6">
          Truenote Admin Portal — Restricted Access
        </p>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
