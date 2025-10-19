import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function CustomerDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        cartItems: 0,
        pendingPayments: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            const [ordersRes, cartRes, paymentsRes] = await Promise.all([
                API.get("/orders"),
                API.get("/cart"),
                API.get("/payments/mine")
            ]);

            const orders = ordersRes.data;
            const cart = cartRes.data;
            const payments = paymentsRes.data;

            setStats({
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => o.status === "PENDING").length,
                completedOrders: orders.filter(o => o.status === "DELIVERED").length,
                totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
                cartItems: cart.items?.length || 0,
                pendingPayments: payments.filter(p => p.status === "PENDING").length
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2>My Dashboard</h2>
            <p style={{ color: "#666", marginBottom: "30px" }}>Welcome back! Here's your shopping overview.</p>

            {/* Stats Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
            }}>
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    color="#007bff"
                    icon="📦"
                    link="/orders"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    color="#ffc107"
                    icon="⏳"
                    link="/orders"
                />
                <StatCard
                    title="Completed Orders"
                    value={stats.completedOrders}
                    color="#28a745"
                    icon="✅"
                    link="/orders"
                />
                <StatCard
                    title="Total Spent"
                    value={`$${stats.totalSpent.toFixed(2)}`}
                    color="#6c757d"
                    icon="💰"
                />
                <StatCard
                    title="Cart Items"
                    value={stats.cartItems}
                    color="#17a2b8"
                    icon="🛒"
                    link="/cart"
                />
                <StatCard
                    title="Pending Payments"
                    value={stats.pendingPayments}
                    color="#dc3545"
                    icon="💳"
                    link="/payments"
                />
            </div>

            {/* Recent Orders */}
            <div style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "20px"
            }}>
                <h3>Recent Orders</h3>
                {recentOrders.length === 0 ? (
                    <p>No orders yet. <Link to="/products">Start shopping!</Link></p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                        <thead>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                            <th style={{ padding: "10px", textAlign: "left" }}>Order ID</th>
                            <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                            <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                            <th style={{ padding: "10px", textAlign: "center" }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                                <td style={{ padding: "10px" }}>#{order.id}</td>
                                <td style={{ padding: "10px" }}>
                                        <span style={{
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            backgroundColor: getStatusColor(order.status),
                                            color: "#fff"
                                        }}>
                                            {order.status}
                                        </span>
                                </td>
                                <td style={{ padding: "10px", textAlign: "right" }}>${order.total}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>
                                    <Link to={`/orders/${order.id}`}>
                                        <button style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}>
                                            View
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <Link to="/products">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        Browse Products
                    </button>
                </Link>
                <Link to="/cart">
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        View Cart
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
                        My Orders
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

function getStatusColor(status) {
    const colors = {
        PENDING: "#ffc107",
        CONFIRMED: "#17a2b8",
        PROCESSING: "#007bff",
        SHIPPED: "#6c757d",
        DELIVERED: "#28a745",
        CANCELLED: "#dc3545"
    };
    return colors[status] || "#6c757d";
}
