import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateProfile,
  changePassword,
  clearError,
  logout,
} from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getImageUrl, getImageUrlFromObject } from "@/utils/imageUrl";

const menuItems = [
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Saved Addresses", href: "/addresses" },
  { label: "Subscriptions", href: "/my_subscription" },
  { label: "Loyalty Points", href: "/loyalty" },
  { label: "Order History", href: "/order_history" },
];

// ── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({
  open,
  onClose,
  user,
  loading,
  onSaveProfile,
  onSavePassword,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
  loading: boolean;
  onSaveProfile: (d: {
    name: string;
    email: string;
    phone: string;
    avatar?: File;
  }) => void;
  onSavePassword: (d: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}) => {
  const [tab, setTab] = useState<"profile" | "password">("profile");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avatarUrl || "",
  );
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens with new user data
  useEffect(() => {
    if (open && user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setAvatarPreview(user.avatarUrl || "");
      setSelectedAvatar(null);
    }
  }, [open, user]);

  if (!open) return null;

  const inputCls =
    "w-full px-4 py-3 outline outline-1 outline-[rgba(71,70,83,0.40)] bg-transparent text-[#333] placeholder-[rgba(51,51,51,0.40)] text-base font-medium focus:outline-[#474653] transition-all rounded-lg";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      avatar: selectedAvatar || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-[#F6DDC5] rounded-2xl w-full max-w-[480px] p-6 flex flex-col gap-5 shadow-xl">
        {/* Tab Buttons */}
        <div className="flex gap-4 border-b border-[rgba(71,70,83,0.20)]">
          <button
            onClick={() => setTab("profile")}
            className={`text-base font-semibold pb-2 transition-all ${
              tab === "profile"
                ? "text-[#474653] border-b-2 border-[#474653]"
                : "text-[#474653]/60 hover:text-[#474653]"
            }`}
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setTab("password")}
            className={`text-base font-semibold pb-2 transition-all ${
              tab === "password"
                ? "text-[#474653] border-b-2 border-[#474653]"
                : "text-[#474653]/60 hover:text-[#474653]"
            }`}
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Change Password
          </button>
        </div>

        {tab === "profile" ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmitProfile}>
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#474653] flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-white text-3xl font-semibold"
                      style={{ fontFamily: "'League Spartan', sans-serif" }}
                    >
                      {profileForm.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-[#474653] rounded-full p-1.5 hover:bg-[#5a5a6b] transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p
                className="text-xs text-[#474653]/60"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Click the icon to change avatar
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-[#474653]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Full Name
              </label>
              <input
                type="text"
                className={inputCls}
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-[#474653]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Email Address
              </label>
              <input
                type="email"
                className={inputCls}
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-[#474653]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                className={inputCls}
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, phone: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl outline outline-1 outline-[#474653] text-[#474653] font-semibold"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#474653] text-white font-semibold disabled:opacity-50"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSavePassword(passwordForm);
            }}
          >
            {(
              ["currentPassword", "newPassword", "confirmPassword"] as const
            ).map((field, i) => (
              <div key={field} className="flex flex-col gap-1">
                <label
                  className="text-sm font-medium text-[#474653]"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {
                    [
                      "Current Password",
                      "New Password",
                      "Confirm New Password",
                    ][i]
                  }
                </label>
                <input
                  type="password"
                  className={inputCls}
                  value={passwordForm[field]}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            ))}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl outline outline-1 outline-[#474653] text-[#474653] font-semibold"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#474653] text-white font-semibold disabled:opacity-50"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((s) => s.auth);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSaveProfile = async (data: {
    name: string;
    email: string;
    phone: string;
    avatar?: File;
  }) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully");
      setEditOpen(false);
    }
  };

  const handleSavePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    const result = await dispatch(
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    );
    if (changePassword.fulfilled.match(result)) {
      toast.success("Password changed successfully");
      setEditOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return null;
    return getImageUrl(user.avatarUrl);
  };

  return (
    <div className="relative min-h-screen bg-[#E2C4A7] overflow-x-hidden">
      {/* side white glows — original values, hidden on small screens to prevent overflow */}
      <div
        className="absolute z-0 pointer-events-none hidden sm:block"
        style={{
          width: 309,
          height: 933,
          left: -175,
          top: 230,
          background: "rgba(255,255,255,0.50)",
          borderRadius: 9999,
          filter: "blur(216px)",
        }}
      />
      <div
        className="absolute z-0 pointer-events-none hidden sm:block"
        style={{
          width: 309,
          height: 933,
          left: 1236,
          top: 230,
          background: "rgba(255,255,255,0.50)",
          borderRadius: 9999,
          filter: "blur(216px)",
        }}
      />

      {/* ── Main card — original padding, reduced on mobile ── */}
      <div className="relative z-10 w-full px-5 sm:px-10 lg:px-[150px] pt-[120px] sm:pt-[150px] lg:pt-[188px] pb-20">
        <div className="w-full max-w-[1140px] mx-auto flex flex-col gap-6">
          {/* ── Profile card — original styles preserved ── */}
          <div
            className="w-full p-4 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
            style={{
              background: "#F6DDC5",
              outline: "1px solid rgba(71,70,83,0.30)",
            }}
          >
            {/* avatar + info — centered column, original */}
            <div className="flex flex-col items-center gap-6 flex-1">
              {/* avatar */}
              <div className="p-[10px] rounded-full outline outline-1 outline-black">
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()!}
                    alt={user?.name}
                    className="w-[88px] h-[88px] rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-[88px] h-[88px] rounded-full bg-[#474653] flex items-center justify-center text-white text-3xl font-semibold"
                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                  >
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}
              </div>
              {/* info */}
              <div className="flex flex-col items-center gap-4">
                <span
                  className="text-[#333] text-base font-medium"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {user?.name ?? "—"}
                </span>
                <span
                  className="text-[#333] text-base font-medium"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {user?.email ?? "—"}
                </span>
                <span
                  className="text-[#333] text-base font-medium"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {user?.phone ?? "—"}
                </span>
              </div>
            </div>

            {/* Edit button — original */}
            <button
              onClick={() => setEditOpen(true)}
              className="text-base font-medium flex-shrink-0 hover:opacity-70 transition-opacity"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                color: "rgba(51,51,51,0.80)",
              }}
            >
              Edit
            </button>
          </div>

          {/* ── Menu items — original styles preserved ── */}
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="w-full px-4 py-6 rounded-2xl text-left text-base font-medium text-[#333] hover:opacity-80 transition-opacity"
                style={{
                  background: "#F6DDC5",
                  fontFamily: "'League Spartan', sans-serif",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ── Logout button — original styles, full-width on mobile ── */}
          <div className="flex justify-center mt-4 mb-10">
            <button
              onClick={handleLogout}
              className="px-8 py-5 rounded-[88px] text-white text-xl font-medium transition-opacity hover:opacity-80 w-full sm:w-[312px]"
              style={{
                background: "#474653",
                boxShadow: "0px 8px 16.9px white",
                fontFamily: "'League Spartan', sans-serif",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        loading={loading}
        onSaveProfile={handleSaveProfile}
        onSavePassword={handleSavePassword}
      />
    </div>
  );
}
