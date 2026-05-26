import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/forgot-password`,
        { email }
      );
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-600">Truenote Coffee</h1>
          <p className="text-gray-500 mt-1 text-sm">Forgot your password?</p>
        </div>

        {success ? (
          /* Success state */
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm mb-6">
              If an account exists for <strong>{email}</strong>, we've sent a
              password reset link. Check your inbox (and spam folder).
            </p>
            <Link
              to="/login"
              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          /* Form state */
          <>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
