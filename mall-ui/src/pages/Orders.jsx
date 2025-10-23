import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersErrors, setOrdersErrors] = useState({});

    useEffect(() => {
        API.get("/orders")
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // Validation helpers
    function validateOrder(order) {
        if (!order || !order.id) return "Invalid order data.";
        if (!order.status) return "Order status is missing.";
        if (order.total == null || order.total < 0) return "Invalid order total.";
        if (!order.items || order.items.length === 0) return "Order has no items.";
        return "";
    }

    function validateOrders(ordersList) {
        const errors = {};
        for (const ord of ordersList || []) {
            const err = validateOrder(ord);
            if (err) errors[ord.id] = err;
        }
        return errors;
    }

    // Revalidate when orders change
    useEffect(() => {
        const errs = validateOrders(orders);
        setOrdersErrors(errs);
    }, [orders]);

    // Helper function to get status color and icon
    const getStatusStyle = (status) => {
        const styles = {
            PENDING: { color: "#FFA500", bg: "rgba(255,165,0,0.1)", icon: "⏳", label: "Pending" },
            CONFIRMED: { color: "#1E90FF", bg: "rgba(30,144,255,0.1)", icon: "✓", label: "Confirmed" },
            SHIPPED: { color: "#4B368B", bg: "rgba(75,54,139,0.1)", icon: "🚚", label: "Shipped" },
            DELIVERED: { color: "#4CAF50", bg: "rgba(76,175,80,0.1)", icon: "✅", label: "Delivered" },
            CANCELLED: { color: "#dc3545", bg: "rgba(220,53,69,0.1)", icon: "❌", label: "Cancelled" }
        };
        return styles[status] || styles.PENDING;
    };

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)"
            }}>
                <div style={{ color: "white", fontSize: "24px", fontWeight: "600" }}>
                    Loading orders...
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: "-10%",
                    right: "-5%",
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, rgba(255,165,0,0.2), transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)"
                }} />

                <div style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "24px",
                    padding: "60px 80px",
                    textAlign: "center",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                    zIndex: 1
                }}>
                    <div style={{ fontSize: "120px", marginBottom: "24px" }}>📦</div>
                    <h2 style={{ fontSize: "32px", color: "white", marginBottom: "16px", fontWeight: "800" }}>
                        No Orders Yet
                    </h2>
                    <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", marginBottom: "30px" }}>
                        You haven't placed any orders yet
                    </p>
                    <Link to="/products">
                        <button style={{
                            padding: "16px 40px",
                            background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "18px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 8px 24px rgba(255,165,0,0.4)",
                            transition: "all 0.3s"
                        }}>
                            Start Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "40px" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        Your Orders
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        Track and manage your orders
                    </p>
                </div>

                {/* Orders List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {orders.map(order => {
                        const statusStyle = getStatusStyle(order.status);
                        const orderErr = ordersErrors[order.id];

                        return (
                            <div key={order.id} style={{
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: orderErr ? "2px solid #dc3545" : "1px solid rgba(255,255,255,0.3)",
                                borderRadius: "20px",
                                padding: "30px",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                                transition: "all 0.3s ease",
                                cursor: "pointer"
                            }}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = "translateY(-5px)";
                                     e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = "translateY(0)";
                                     e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
                                 }}
                            >
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr auto auto",
                                    gap: "24px",
                                    alignItems: "center"
                                }}>
                                    {/* Order Icon */}
                                    <div style={{
                                        width: "70px",
                                        height: "70px",
                                        background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                        borderRadius: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "32px",
                                        boxShadow: "0 4px 15px rgba(30,144,255,0.3)"
                                    }}>
                                        📦
                                    </div>

                                    {/* Order Info */}
                                    <div>
                                        <div style={{
                                            fontSize: "20px",
                                            fontWeight: "800",
                                            color: "#1A1A2E",
                                            marginBottom: "8px"
                                        }}>
                                            Order #{order.id}
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            gap: "20px",
                                            fontSize: "14px",
                                            color: "#666"
                                        }}>
                                            <span>
                                                <strong>{order.items?.length || 0}</strong> item{order.items?.length !== 1 ? 's' : ''}
                                            </span>
                                            {order.createdAt && (
                                                <span>
                                                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                            {order.total && (
                                                <span style={{
                                                    fontWeight: "700",
                                                    background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent"
                                                }}>
                                                    ${order.total.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div style={{
                                        padding: "12px 24px",
                                        background: statusStyle.bg,
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        border: `2px solid ${statusStyle.color}`
                                    }}>
                                        <span style={{ fontSize: "20px" }}>{statusStyle.icon}</span>
                                        <span style={{
                                            fontWeight: "700",
                                            color: statusStyle.color,
                                            fontSize: "14px"
                                        }}>
                                            {statusStyle.label}
                                        </span>
                                    </div>

                                    {/* View Details Button */}
                                    <Link to={`/orders/${order.id}`} style={{ textDecoration: "none" }}>
                                        <button
                                            disabled={!!orderErr}
                                            style={{
                                                padding: "12px 24px",
                                                background: orderErr
                                                    ? "#ccc"
                                                    : "linear-gradient(135deg, #1E90FF, #4B368B)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "12px",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                                cursor: orderErr ? "not-allowed" : "pointer",
                                                boxShadow: orderErr ? "none" : "0 4px 15px rgba(30,144,255,0.3)",
                                                transition: "all 0.3s",
                                                whiteSpace: "nowrap"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!orderErr) {
                                                    e.target.style.transform = "scale(1.05)";
                                                    e.target.style.boxShadow = "0 6px 20px rgba(30,144,255,0.4)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!orderErr) {
                                                    e.target.style.transform = "scale(1)";
                                                    e.target.style.boxShadow = "0 4px 15px rgba(30,144,255,0.3)";
                                                }
                                            }}
                                            title={orderErr || "View order details"}
                                        >
                                            View Details →
                                        </button>
                                    </Link>
                                </div>

                                {/* Inline order error */}
                                {orderErr && (
                                    <p style={{ color: "#dc3545", fontSize: 14, marginTop: 16 }}>
                                        {orderErr}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Summary Card */}
                <div style={{
                    marginTop: "40px",
                    background: "linear-gradient(135deg, rgba(30,144,255,0.1), rgba(75,54,139,0.1))",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "2px solid rgba(30,144,255,0.3)",
                    borderRadius: "20px",
                    padding: "30px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "30px",
                        textAlign: "center"
                    }}>
                        <div>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: "800",
                                background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: "8px"
                            }}>
                                {orders.length}
                            </div>
                            <div style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>
                                Total Orders
                            </div>
                        </div>

                        <div>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: "800",
                                background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: "8px"
                            }}>
                                {orders.filter(o => o.status === "PENDING").length}
                            </div>
                            <div style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>
                                Pending
                            </div>
                        </div>

                        <div>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: "800",
                                color: "#4CAF50",
                                marginBottom: "8px"
                            }}>
                                {orders.filter(o => o.status === "DELIVERED").length}
                            </div>
                            <div style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>
                                Delivered
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
