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

            setLowStockProducts(lowStock.slice(0, 5));
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2>Vendor Dashboard</h2>
            <p style={{ color: "#666", marginBottom: "30px" }}>Manage your inventory and orders.</p>

            {/* Stats Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
            }}>
                <StatCard title="Total Products" value={stats.totalProducts} color="#007bff" icon="📦" link="/products" />
                <StatCard title="Low Stock" value={stats.lowStockProducts} color="#dc3545" icon="⚠️" />
                <StatCard title="Total Orders" value={stats.totalOrders} color="#28a745" icon="🛒" link="/orders" />
                <StatCard title="Pending Orders" value={stats.pendingOrders} color="#ffc107" icon="⏳" link="/orders" />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="#6c757d" icon="💰" />
                <StatCard title="Active Discounts" value={stats.activeDiscounts} color="#17a2b8" icon="🎫" link="/discounts" />
            </div>

            {/* Low Stock Alert */}
            {stats.lowStockProducts > 0 && (
                <div style={{
                    backgroundColor: "#fff3cd",
                    border: "2px solid #ffc107",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "30px"
                }}>
                    <h3 style={{ color: "#856404" }}>⚠️ Low Stock Alert</h3>
                    <p>The following products are running low on stock:</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                        <thead>
                        <tr style={{ backgroundColor: "#fff" }}>
                            <th style={{ padding: "10px", textAlign: "left" }}>Product</th>
                            <th style={{ padding: "10px", textAlign: "center" }}>Stock</th>
                            <th style={{ padding: "10px", textAlign: "center" }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lowStockProducts.map(product => (
                            <tr key={product.id} style={{ borderTop: "1px solid #ffc107" }}>
                                <td style={{ padding: "10px" }}>{product.name}</td>
                                <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold", color: "#dc3545" }}>
                                    {product.stock}
                                </td>
                                <td style={{ padding: "10px", textAlign: "center" }}>
                                    <Link to={`/products/${product.id}/edit`}>
                                        <button style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}>
                                            Restock
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                <Link to="/products">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        Manage Products
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
                        View Orders
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
