import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AppLayout({ children }) {
    const { token, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div style={{ margin: 0, padding: 0, minHeight: "100vh" }}>
            <nav style={{
                background: "#1A1A2E",
                color: "#fff",
                padding: "15px 30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                position: "sticky",
                top: 0,
                zIndex: 1000
            }}>
                {/* Left Side - Logo & Main Links */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Link to="/" style={{
                        color: "#fff",
                        textDecoration: "none",
                        fontSize: "24px",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        🛒 <span>Mall</span>
                    </Link>

                    {token && (
                        <>
                            <Link to="/dashboard" style={{
                                color: "#fff",
                                textDecoration: "none",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                fontWeight: "600",
                                transition: "all 0.3s"
                            }}>
                                📊 Dashboard
                            </Link>
                            <Link to="/products" style={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: "500",
                                transition: "color 0.3s"
                            }}>
                                Products
                            </Link>

                            {/* Customer-only links */}
                            {role === "CUSTOMER" && (
                                <>
                                    <Link to="/cart" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        🛒 Cart
                                    </Link>
                                    <Link to="/orders" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        My Orders
                                    </Link>
                                    <Link to="/payments" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Payments
                                    </Link>
                                </>
                            )}

                            {/* Vendor links */}
                            {role === "VENDOR" && (
                                <>
                                    <Link to="/orders" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Orders
                                    </Link>
                                    <Link to="/discounts" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Discounts
                                    </Link>
                                </>
                            )}

                            {/* Admin links */}
                            {role === "ADMIN" && (
                                <>
                                    <Link to="/orders" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Orders
                                    </Link>
                                    <Link to="/payments" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Payments
                                    </Link>
                                    <Link to="/admin/reviews" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Reviews
                                    </Link>
                                    <Link to="/discounts" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Discounts
                                    </Link>
                                    <Link to="/categories" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>
                                        Categories
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Right Side - Profile & Auth */}
                <div>
                    {token ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <Link to="/profile" style={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: "500"
                            }}>
                                Profile
                            </Link>
                            <span style={{
                                fontSize: "12px",
                                backgroundColor: role === "ADMIN" ? "#dc3545" :
                                    role === "VENDOR" ? "#28a745" : "#1E90FF",
                                padding: "6px 14px",
                                borderRadius: "20px",
                                fontWeight: "700",
                                letterSpacing: "0.5px"
                            }}>
                                {role}
                            </span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "8px 20px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    transition: "all 0.3s"
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", gap: "12px" }}>
                            <Link to="/login">
                                <button style={{
                                    padding: "8px 20px",
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    transition: "all 0.3s"
                                }}>
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button style={{
                                    padding: "8px 20px",
                                    background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    boxShadow: "0 4px 15px rgba(255, 165, 0, 0.4)",
                                    transition: "all 0.3s"
                                }}>
                                    Register
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content - NO PADDING! */}
            <main style={{ margin: 0, padding: 0 }}>
                {children}
            </main>
        </div>
    );
}
