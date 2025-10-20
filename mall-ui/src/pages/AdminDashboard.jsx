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
                totalUsers: 0,
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

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)"
            }}>
                <div style={{ color: "#666", fontSize: "20px", fontWeight: "700" }}>
                    ⏳ Loading dashboard...
                </div>
            </div>
        );
    }

    const statCards = [
        { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "linear-gradient(135deg, #1E90FF, #4B368B)" },
        { label: "Total Orders", value: stats.totalOrders, icon: "🛒", color: "linear-gradient(135deg, #4CAF50, #45a049)" },
        { label: "Pending Payments", value: stats.pendingPayments, icon: "💳", color: "linear-gradient(135deg, #FFA500, #FF8C00)" },
        { label: "Pending Reviews", value: stats.pendingReviews, icon: "⭐", color: "linear-gradient(135deg, #9C27B0, #7B1FA2)" },
        { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: "💰", color: "linear-gradient(135deg, #4CAF50, #45a049)" },
        { label: "Active Discounts", value: stats.activeDiscounts, icon: "🏷️", color: "linear-gradient(135deg, #dc3545, #c82333)" }
    ];

    const quickActions = [
        { label: "Manage Products", icon: "📦", link: "/products", color: "#1E90FF" },
        { label: "View Orders", icon: "🛒", link: "/orders", color: "#4CAF50" },
        { label: "Payments", icon: "💳", link: "/payments", color: "#FFA500" },
        { label: "Categories", icon: "🗂️", link: "/categories", color: "#9C27B0" },
        { label: "Discounts", icon: "🏷️", link: "/discounts", color: "#dc3545" },
        { label: "Reviews", icon: "⭐", link: "/reviews", color: "#FF6B6B" }
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "40px", textAlign: "center" }}>
                    <h1 style={{
                        fontSize: "48px",
                        fontWeight: "800",
                        background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "8px"
                    }}>
                        👑 Admin Dashboard
                    </h1>
                    <p style={{ color: "#666", fontSize: "18px", fontWeight: "600" }}>
                        System overview and management
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "24px",
                    marginBottom: "40px"
                }}>
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            style={{
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.3)",
                                borderRadius: "20px",
                                padding: "28px",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                                transition: "all 0.3s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <p style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        fontWeight: "600",
                                        marginBottom: "8px",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px"
                                    }}>
                                        {stat.label}
                                    </p>
                                    <h3 style={{
                                        fontSize: "32px",
                                        fontWeight: "800",
                                        color: "#1A1A2E",
                                        margin: 0
                                    }}>
                                        {stat.value}
                                    </h3>
                                </div>
                                <div style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "16px",
                                    background: stat.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "28px",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
                                }}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "24px"
                    }}>
                        ⚡ Quick Actions
                    </h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px"
                    }}>
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.link}
                                style={{
                                    textDecoration: "none",
                                    padding: "20px",
                                    background: `linear-gradient(135deg, ${action.color}15, ${action.color}25)`,
                                    borderRadius: "16px",
                                    border: `2px solid ${action.color}40`,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "12px",
                                    transition: "all 0.3s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.borderColor = action.color;
                                    e.currentTarget.style.boxShadow = `0 8px 24px ${action.color}40`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.borderColor = `${action.color}40`;
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <span style={{ fontSize: "36px" }}>{action.icon}</span>
                                <span style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    textAlign: "center"
                                }}>
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
