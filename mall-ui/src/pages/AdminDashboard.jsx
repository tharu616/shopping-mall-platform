import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        pendingPayments: 0,
        pendingReviews: 0,
        totalRevenue: 0,
        activeDiscounts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            const [productsRes, ordersRes, paymentsRes, reviewsRes, discountsRes] = await Promise.all([
                API.get("/products"),
                API.get("/orders?status=all"),
                API.get("/payments/pending"),
                API.get("/reviews/pending"),
                API.get("/discounts")
            ]);

            const products = productsRes.data;
            const orders = ordersRes.data;
            const payments = paymentsRes.data;
            const reviews = reviewsRes.data;
            const discounts = discountsRes.data;

            setStats({
                totalUsers: 0, // You can add a users endpoint if needed
                totalProducts: products.length,
                totalOrders: orders.length,
                pendingPayments: payments.length,
                pendingReviews: reviews.length,
                totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
                activeDiscounts: discounts.filter(d => d.active).length
            });
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2>Admin Dashboard</h2>
            <p style={{ color: "#666", marginBottom: "30px" }}>System overview and management.</p>

            {/* Stats Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
            }}>
                <StatCard title="Total Products" value={stats.totalProducts} color="#007bff" icon="📦" link="/products" />
                <StatCard title="Total Orders" value={stats.totalOrders} color="#28a745" icon="🛒" link="/orders" />
                <StatCard title="Pending Payments" value={stats.pendingPayments} color="#ffc107" icon="💳" link="/payments" />
                <StatCard title="Pending Reviews" value={stats.pendingReviews} color="#dc3545" icon="⭐" link="/admin/reviews" />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="#6c757d" icon="💰" />
                <StatCard title="Active Discounts" value={stats.activeDiscounts} color="#17a2b8" icon="🎫" link="/discounts" />
            </div>

            {/* Alerts */}
            {(stats.pendingPayments > 0 || stats.pendingReviews > 0) && (
                <div style={{
                    backgroundColor: "#f8d7da",
                    border: "2px solid #dc3545",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "30px"
                }}>
                    <h3 style={{ color: "#721c24" }}>⚠️ Pending Actions Required</h3>
                    <ul style={{ marginTop: "10px", lineHeight: "2" }}>
                        {stats.pendingPayments > 0 && (
                            <li>
                                <b>{stats.pendingPayments}</b> payments awaiting approval. <Link to="/payments">Review now →</Link>
                            </li>
                        )}
                        {stats.pendingReviews > 0 && (
                            <li>
                                <b>{stats.pendingReviews}</b> reviews awaiting moderation. <Link to="/admin/reviews">Review now →</Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <Link to="/products/create">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        + Add Product
                    </button>
                </Link>
                <Link to="/discounts/create">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#17a2b8",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        + Create Discount
                    </button>
                </Link>
                <Link to="/payments">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#ffc107",
                        color: "#000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        Review Payments
                    </button>
                </Link>
                <Link to="/admin/reviews">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        Moderate Reviews
                    </button>
                </Link>
                <Link to="/orders">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        Manage Orders
                    </button>
                </Link>
            </div>
        </div>
    );
}

function StatCard({ title, value, color, icon, link }) {
    const card = (
        <div style={{
            backgroundColor: "#fff",
            border: `2px solid ${color}`,
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            cursor: link ? "pointer" : "default",
            transition: "transform 0.2s"
        }}
             onMouseEnter={(e) => link && (e.currentTarget.style.transform = "scale(1.05)")}
             onMouseLeave={(e) => link && (e.currentTarget.style.transform = "scale(1)")}
        >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color }}>{value}</div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>{title}</div>
        </div>
    );

    return link ? <Link to={link} style={{ textDecoration: "none" }}>{card}</Link> : card;
}
