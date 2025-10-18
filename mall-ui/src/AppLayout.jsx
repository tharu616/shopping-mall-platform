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
        <div>
            <nav style={{ background: "#222", color: "#fff", padding: "12px" }}>
                <Link to="/" style={{ color: "#fff", marginRight: 16 }}>Home</Link>
                {token ? (
                    <>
                        <Link to="/profile" style={{color:"#fff",marginRight:16}}>Profile</Link>
                        <Link to="/products" style={{color:"#fff",marginRight:16}}>Products</Link>
                        <Link to="/cart" style={{color:"#fff",marginRight:16}}>Cart</Link>
                        <Link to="/orders" style={{color:"#fff",marginRight:16}}>Orders</Link>
                        <Link to="/payments" style={{color:"#fff",marginRight:16}}>Payments</Link>
                        {role === "VENDOR" && (
                            <Link to="/dashboard/vendor" style={{color:"#fff",marginRight:16}}>Vendor Dashboard</Link>
                        )}
                        {role === "ADMIN" && (
                            <>
                                <Link to="/dashboard/admin" style={{color:"#fff",marginRight:16}}>Admin Dashboard</Link>
                                <Link to="/discounts" style={{color:"#fff",marginRight:16}}>Discounts</Link>
                                <Link to="/categories" style={{color:"#fff",marginRight:16}}>Categories</Link>
                            </>
                        )}
                        <button style={{marginLeft:32}} onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{color:"#fff",marginRight:16}}>Login</Link>
                        <Link to="/register" style={{color:"#fff",marginRight:16}}>Register</Link>
                    </>
                )}
            </nav>
            <main style={{ padding: "24px" }}>
                {children}
            </main>
        </div>
    );
}
