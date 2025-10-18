import AppLayout from "./AppLayout";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CartBadge from "./components/CartBadge";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Discounts from "./pages/Discounts";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductEdit />} />
                <Route path="/products/:id/edit" element={<ProductEdit />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/dashboard/vendor" element={<VendorDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/discounts" element={<Discounts />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppLayout>
    );
    <Link to="/cart">Cart <CartBadge /></Link>
}
