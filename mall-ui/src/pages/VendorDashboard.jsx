import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function VendorDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        activeDiscounts: 0
    });
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            const [productsRes, ordersRes, discountsRes] = await Promise.all([
                API.get("/products"),
                API.get("/orders?status=all"),
                API.get("/discounts")
            ]);

            const products = productsRes.data;
            const orders = ordersRes.data;
            const discounts = discountsRes.data;
            const lowStock = products.filter(p => p.stock < 10);

            setStats({
                totalProducts: products.length,
                lowStockProducts: lowStock.length,
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => o.status === "PENDING").length,
                totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
                activeDiscounts: discounts.filter(d => d.active).length
            });
            setLowStockProducts(lowStock);
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
        { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "linear-gradient(135deg, #4B368B, #2E2566)" },
        { label: "Low Stock Alert", value: stats.lowStockProducts, icon: "⚠️", color: "linear-gradient(135deg, #FFA500, #FF8C00)" },
        { label: "Total Orders", value: stats.totalOrders, icon: "🛒", color: "linear-gradient(135deg, #1E90FF, #4B368B)" },
        { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "linear-gradient(135deg, #9C27B0, #7B1FA2)" },
        { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: "💰", color: "linear-gradient(135deg, #4CAF50, #45a049)" },
        { label: "Active Discounts", value: stats.activeDiscounts, icon: "🏷️", color: "linear-gradient(135deg, #dc3545, #c82333)" }
    ];

    const quickActions = [
        { label: "Add Product", icon: "➕", link: "/products/new", color: "#4CAF50" },
        { label: "My Products", icon: "📦", link: "/products", color: "#4B368B" },
        { label: "View Orders", icon: "🛒", link: "/orders", color: "#1E90FF" },
        { label: "Discounts", icon: "🏷️", link: "/discounts", color: "#dc3545" }
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
                        background: "linear-gradient(135deg, #4B368B, #2E2566)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "8px"
                    }}>
                        🏪 Vendor Dashboard
                    </h1>
                    <p style={{ color: "#666", fontSize: "18px", fontWeight: "600" }}>
                        Manage your store and inventory
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

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "2px solid #FFA50080",
                        borderRadius: "24px",
                        padding: "30px",
                        boxShadow: "0 8px 32px rgba(255,165,0,0.2)",
                        marginBottom: "30px"
                    }}>
                        <h2 style={{
                            fontSize: "24px",
                            fontWeight: "800",
                            color: "#FFA500",
                            marginBottom: "20px"
                        }}>
                            ⚠️ Low Stock Products
                        </h2>
                        <div style={{ display: "grid", gap: "12px" }}>
                            {lowStockProducts.slice(0, 5).map((product, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "16px 20px",
                                        background: "linear-gradient(135deg, rgba(255,165,0,0.1), rgba(255,140,0,0.15))",
                                        borderRadius: "12px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <span style={{ fontWeight: "700", color: "#1A1A2E" }}>
                                        {product.name}
                                    </span>
                                    <span style={{
                                        padding: "6px 12px",
                                        background: "#FFA500",
                                        color: "white",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "700"
                                    }}>
                                        Stock: {product.stock}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
