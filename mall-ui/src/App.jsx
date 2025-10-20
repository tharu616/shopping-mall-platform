import AppLayout from "./AppLayout";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CartBadge from "./components/CartBadge";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Payments from "./pages/Payments";
import UploadPayment from "./pages/UploadPayment";
import PaymentDetail from "./pages/PaymentDetail";
import Dashboard from "./pages/Dashboard";

import Discounts from "./pages/Discounts";
import DiscountForm from "./pages/DiscountForm";
import Categories from "./pages/Categories";
import AdminReviews from "./pages/AdminReviews";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductEdit />} />
                <Route path="/products/:id/edit" element={<ProductEdit />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/create" element={<ProductForm />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/payments/upload" element={<UploadPayment />} />
                <Route path="/payments/:id" element={<PaymentDetail />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/discounts" element={<Discounts />} />
                <Route path="/discounts/create" element={<DiscountForm />} />
                <Route path="/discounts/edit/:id" element={<DiscountForm />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppLayout>
    );
    <Link to="/cart">Cart <CartBadge /></Link>
}
