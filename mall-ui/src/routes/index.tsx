import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import ProductsPage from "../pages/products/List";
import ProductEdit from "../pages/products/Edit";
import CategoriesPage from "../pages/categories/List";
import CartPage from "../pages/cart/Cart";
import OrdersPage from "../pages/orders/List";
import PaymentsPage from "../pages/payments/List";
import ReviewsPage from "../pages/reviews/List";
import ProfilePage from "../pages/profile/Profile";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../store/authStore";
import DashboardSelector from "../pages/dashboards/Dashboard";

export default function RoutesIndex() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
          <Route path="/products/:id/edit" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardSelector /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
