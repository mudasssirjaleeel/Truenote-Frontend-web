import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import BlankLayout from "./components/layout/AdminAuthLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import ProfilePage from "@/pages/profile/ProfilePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import SubscriptionPage from "./pages/SubscriptionsPage";
import MySubscriptionPage from "./pages/profile/MySubscriptionPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBeansPage from "./pages/admin/beans/AdminBeansPage";
import AdminBeanForm from "./pages/admin/beans/AdminBeanForm";
import AdminProductsPage from "./pages/admin/products/AdminProductsPage";
import AdminProductForm from "./pages/admin/products/AdminProductForm";
import AdminOrdersPage from "./pages/admin/orders/AdminOrdersPage";
import AdminOrderDetail from "./pages/admin/orders/AdminOrderDetail";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
import AdminUserDetailPage from "./pages/admin/users/AdminUsersDetailPage";
import AdminCategoriesPage from "./pages/admin/categories/AdminCategoriesPage";
import AdminBannersPage from "./pages/admin/banners/AdminBannersPage";
import AboutPage from "./pages/AboutPage";
import BrewGuidePage from "./pages/BrewGuidePage";
import CoffeeBeansPage from "./pages/CoffeeBeansPage";
import ContactPage from "./pages/ContactPage";
import WishListPage from "./pages/profile/WishListPage";
import SavedAddressPage from "./pages/profile/SavedAddressPage";
import OrderHistoryPage from "./pages/profile/OrderHistoryPage";
import CoffeeBeanDetailsPage from "./pages/CoffeeBeanDetailsPage";
import CartPage from "./pages/profile/CartPage";
import BrewGuideDetailPage01 from "./pages/brewguide_details/BrewGuideDetailPage01";
import BrewGuideDetailPage02 from "./pages/brewguide_details/BrewGuideDetailPage02";
import BrewGuideDetailPage03 from "./pages/brewguide_details/BrewGuideDetailPage03";
import BrewGuideDetailPage04 from "./pages/brewguide_details/BrewGuideDetailPage04";
import AdminSubscriptionsPage from "./pages/admin/subscription/AdminSubscriptionsPage";
import AdminReporting from "./pages/admin/reporting/AdminReportsPage";
import AdminStaffPage from "./pages/admin/staff/AdminStaffPage";
import KDSDisplay from "./pages/admin/kdsDisplay/KDSDisplay";
import UnauthorizedPage from "./pages/admin/UnauthorizedPage";
import AdminPermissionsPage from "./pages/admin/permissions/AdminPermissionsPage";
import UserNotificationsPage from "./pages/profile/UserNotificationsPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((s) => s.auth);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Auth Guard - checks if user is logged in as admin/staff
const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAppSelector((s) => s.auth);
  //  Allow both admin and staff
  const hasAdminAccess = user?.role === "admin" || user?.role === "staff";

  if (!token || !hasAdminAccess) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Public Admin Route - for login page only (no auth required)
const PublicAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAppSelector((s) => s.auth);
  const hasAdminAccess = user?.role === "admin" || user?.role === "staff";

  // If already logged in as admin/staff, redirect to dashboard
  if (token && hasAdminAccess) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      {/* Auth Layout - FOR REGULAR USER LOGIN/REGISTER */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/wishlist" element={<WishListPage />} />
        <Route path="/addresses" element={<SavedAddressPage />} />
        <Route path="/order_history" element={<OrderHistoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/my_subscription" element={<MySubscriptionPage />} />
        <Route path="/notifications" element={<UserNotificationsPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* /admin/login - accessible without authentication */}
      <Route
        path="/admin/login"
        element={
          <PublicAdminRoute>
            <AdminLoginPage />
          </PublicAdminRoute>
        }
      />

      {/* /admin/unauthorized - accessible without auth */}
      <Route
        path="/admin/unauthorized"
        element={
          <BlankLayout>
            <UnauthorizedPage />
          </BlankLayout>
        }
      />

      {/* Main Layout - FOR PROTECTED USER PAGES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/brew_guide" element={<BrewGuidePage />} />
        <Route
          path="/brew_guide/hario-v60"
          element={<BrewGuideDetailPage01 />}
        />
        <Route
          path="/brew_guide/kalita-wave"
          element={<BrewGuideDetailPage02 />}
        />
        <Route path="/brew_guide/chemex" element={<BrewGuideDetailPage03 />} />
        <Route
          path="/brew_guide/clever-dripper"
          element={<BrewGuideDetailPage04 />}
        />
        <Route path="/coffee_beans" element={<CoffeeBeansPage />} />
        <Route path="/coffee_beans/:id" element={<CoffeeBeanDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Route>

      {/* All admin routes are protected by AdminAuthGuard */}
      <Route
        element={
          <AdminAuthGuard>
            <AdminLayout />
          </AdminAuthGuard>
        }
      >
        {/* Dashboard - view_dashboard required */}
        <Route element={<AdminRoute permission="view_dashboard" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Beans - view_beans required */}
        <Route element={<AdminRoute permission="view_beans" />}>
          <Route path="/admin/beans" element={<AdminBeansPage />} />
        </Route>

        {/* Notifications - view_dashboard required */}
        <Route element={<AdminRoute permission="view_dashboard" />}>
          <Route
            path="/admin/notifications"
            element={<AdminNotificationsPage />}
          />
        </Route>

        {/* Beans Edit - edit_beans required */}
        <Route element={<AdminRoute permission="edit_beans" />}>
          <Route path="/admin/beans/new" element={<AdminBeanForm />} />
          <Route path="/admin/beans/:id/edit" element={<AdminBeanForm />} />
        </Route>

        {/* Products/Menu - view_menu required */}
        <Route element={<AdminRoute permission="view_menu" />}>
          <Route path="/admin/products" element={<AdminProductsPage />} />
        </Route>

        {/* Products Edit - edit_menu required */}
        <Route element={<AdminRoute permission="edit_menu" />}>
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route
            path="/admin/products/:id/edit"
            element={<AdminProductForm />}
          />
        </Route>

        {/* Orders - view_orders required */}
        <Route element={<AdminRoute permission="view_orders" />}>
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        </Route>

        {/* Customers - view_customers required */}
        <Route element={<AdminRoute permission="view_customers" />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
        </Route>

        {/* Categories - view_categories required */}
        <Route element={<AdminRoute permission="view_categories" />}>
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        </Route>

        {/* Banners - view_banners required */}
        <Route element={<AdminRoute permission="view_banners" />}>
          <Route path="/admin/banners" element={<AdminBannersPage />} />
        </Route>

        {/* Subscriptions - view_subscriptions required */}
        <Route element={<AdminRoute permission="view_subscriptions" />}>
          <Route
            path="/admin/subscriptions"
            element={<AdminSubscriptionsPage />}
          />
        </Route>

        {/* Reports - view_reports required */}
        <Route element={<AdminRoute permission="view_reports" />}>
          <Route path="/admin/reports_summary" element={<AdminReporting />} />
        </Route>

        {/* Staff - view_staff required */}
        <Route element={<AdminRoute permission="view_staff" />}>
          <Route path="/admin/staff" element={<AdminStaffPage />} />
        </Route>

        {/* KDS - view_kds required */}
        <Route element={<AdminRoute permission="view_kds" />}>
          <Route path="/admin/kds" element={<KDSDisplay />} />
        </Route>

        {/* Permissions - manage_staff_roles required */}
        <Route element={<AdminRoute permission="manage_staff_roles" />}>
          <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
        </Route>
      </Route>

      {/* Redirects */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
