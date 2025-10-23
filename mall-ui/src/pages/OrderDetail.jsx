import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function OrderDetail() {
    const { id } = useParams();
    const { role } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [updateMsg, setUpdateMsg] = useState("");
    const [statusError, setStatusError] = useState("");

    const getValidNextStatuses = (currentStatus) => {
        const transitions = {
            PENDING: ["CONFIRMED", "CANCELLED"],
            CONFIRMED: ["PROCESSING", "CANCELLED"],
            PROCESSING: ["SHIPPED"],
            SHIPPED: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: []
        };
        return transitions[currentStatus] || [];
    };

    const getStatusStyle = (status) => {
        const styles = {
            PENDING: { color: "#FFA500", bg: "rgba(255,165,0,0.1)", icon: "⏳" },
            CONFIRMED: { color: "#1E90FF", bg: "rgba(30,144,255,0.1)", icon: "✓" },
            PROCESSING: { color: "#4B368B", bg: "rgba(75,54,139,0.1)", icon: "⚙️" },
            SHIPPED: { color: "#4B368B", bg: "rgba(75,54,139,0.1)", icon: "🚚" },
            DELIVERED: { color: "#4CAF50", bg: "rgba(76,175,80,0.1)", icon: "✅" },
            CANCELLED: { color: "#dc3545", bg: "rgba(220,53,69,0.1)", icon: "❌" }
        };
        return styles[status] || styles.PENDING;
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    function fetchOrder() {
        setLoading(true);
        API.get(`/orders/${id}`)
            .then(res => {
                setOrder(res.data);
                setNewStatus(res.data.status);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Order not found or access denied.");
            })
            .finally(() => setLoading(false));
    }

    // Validation helpers
    function validateStatusTransition(currentStatus, nextStatus) {
        if (!currentStatus || !nextStatus) return "Invalid status.";
        if (currentStatus === nextStatus) return "Please select a different status.";

        const validNext = getValidNextStatuses(currentStatus);
        if (!validNext.includes(nextStatus)) {
            return `Cannot change from ${currentStatus} to ${nextStatus}.`;
        }
        return "";
    }

    function validateOrderData(ord) {
        if (!ord || !ord.id) return "Invalid order data.";
        if (!ord.status) return "Order status is missing.";
        if (ord.total == null || ord.total < 0) return "Invalid order total.";
        if (!ord.items || ord.items.length === 0) return "Order has no items.";
        return "";
    }

    // Revalidate status when newStatus changes
    useEffect(() => {
        if (order && newStatus) {
            const err = validateStatusTransition(order.status, newStatus);
            setStatusError(err);
        }
    }, [newStatus, order]);

    async function handleStatusUpdate() {
        setUpdateMsg("");

        const transErr = validateStatusTransition(order.status, newStatus);
        if (transErr) {
            setUpdateMsg(transErr);
            return;
        }

        try {
            await API.patch(`/orders/${id}/status`, { status: newStatus });
            setUpdateMsg("Status updated successfully!");
            setTimeout(() => navigate("/orders"), 1000);
        } catch (err) {
            console.error("Update error:", err);
            const errorMsg = err.response?.data?.message || err.response?.data || "Failed to update status.";
            setUpdateMsg(`Error: ${errorMsg}`);
        }
    }

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
                    Loading order details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)"
            }}>
                <div style={{
                    background: "rgba(220,53,69,0.2)",
                    backdropFilter: "blur(20px)",
                    padding: "40px 60px",
                    borderRadius: "20px",
                    textAlign: "center",
                    border: "2px solid #dc3545"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>⚠️</div>
                    <h2 style={{ color: "white", marginBottom: "20px" }}>{error}</h2>
                    <Link to="/orders">
                        <button style={{
                            padding: "12px 30px",
                            background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}>
                            ← Back to Orders
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const validStatuses = getValidNextStatuses(order.status);
    const statusStyle = getStatusStyle(order.status);
    const orderDataErr = validateOrderData(order);

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: "30px" }}>
                    <Link to="/orders" style={{
                        color: "#1E90FF",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        ← Back to Orders
                    </Link>
                </div>

                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}>
                    <h1 style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#1A1A2E"
                    }}>
                        Order #{order.id}
                    </h1>

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
                            fontSize: "16px"
                        }}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Global order data validation error */}
                {orderDataErr && (
                    <div style={{
                        marginBottom: "24px",
                        padding: "16px",
                        background: "rgba(220,53,69,0.1)",
                        border: "2px solid #dc3545",
                        borderRadius: "12px",
                        color: "#dc3545",
                        fontWeight: "600"
                    }}>
                        ⚠️ {orderDataErr}
                    </div>
                )}

                {/* Order Info Card - Glassmorphism */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "20px",
                    padding: "30px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    marginBottom: "24px"
                }}>
                    <h3 style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "20px"
                    }}>
                        Order Information
                    </h3>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px"
                    }}>
                        <InfoItem label="Total Amount" value={`$${order.total}`} gradient={true} />
                        <InfoItem label="User Email" value={order.userEmail} />
                        <InfoItem label="Created Date" value={order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"} />
                    </div>

                    {order.shippingAddress && (
                        <div style={{
                            marginTop: "20px",
                            padding: "16px",
                            background: "rgba(30,144,255,0.05)",
                            borderRadius: "12px",
                            border: "1px solid rgba(30,144,255,0.1)"
                        }}>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#666", marginBottom: "8px" }}>
                                Shipping Address:
                            </div>
                            <div style={{ color: "#1A1A2E", lineHeight: "1.6" }}>
                                {order.shippingAddress}
                            </div>
                        </div>
                    )}
                </div>

                {/* Items Table - Glassmorphism */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "20px",
                    padding: "30px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    marginBottom: "24px",
                    overflowX: "auto"
                }}>
                    <h3 style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "20px"
                    }}>
                        Order Items ({order.items?.length || 0})
                    </h3>

                    {order.items && order.items.length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
                            <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Product</th>
                                <th style={tableHeaderStyle}>SKU</th>
                                <th style={{...tableHeaderStyle, textAlign: "right"}}>Price</th>
                                <th style={{...tableHeaderStyle, textAlign: "center"}}>Qty</th>
                                <th style={{...tableHeaderStyle, textAlign: "right"}}>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.items.map(item => (
                                <tr key={item.id} style={{
                                    background: "rgba(30,144,255,0.03)",
                                    transition: "all 0.3s"
                                }}>
                                    <td style={tableCellStyle}>
                                        <strong style={{ color: "#1A1A2E" }}>{item.name}</strong>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{ color: "#666", fontSize: "14px" }}>{item.sku}</span>
                                    </td>
                                    <td style={{...tableCellStyle, textAlign: "right"}}>
                                        ${item.price}
                                    </td>
                                    <td style={{...tableCellStyle, textAlign: "center"}}>
                                        <span style={{
                                            padding: "4px 12px",
                                            background: "rgba(30,144,255,0.1)",
                                            borderRadius: "8px",
                                            fontWeight: "700",
                                            color: "#1E90FF"
                                        }}>
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td style={{...tableCellStyle, textAlign: "right"}}>
                                        <strong style={{
                                            fontSize: "16px",
                                            background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent"
                                        }}>
                                            ${item.lineTotal}
                                        </strong>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                            No items in this order
                        </div>
                    )}
                </div>

                {/* Admin/Vendor Status Update - Glassmorphism */}
                {(role === "ADMIN" || role === "VENDOR") && validStatuses.length > 0 && (
                    <div style={{
                        background: "linear-gradient(135deg, rgba(76,175,80,0.1), rgba(30,144,255,0.1))",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: statusError ? "2px solid #dc3545" : "2px solid #4CAF50",
                        borderRadius: "20px",
                        padding: "30px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                    }}>
                        <h3 style={{
                            fontSize: "20px",
                            fontWeight: "800",
                            color: "#1A1A2E",
                            marginBottom: "12px"
                        }}>
                            🔄 Update Order Status
                        </h3>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                            Current status: <strong style={{ color: statusStyle.color }}>{order.status}</strong>
                        </p>

                        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                style={{
                                    padding: "14px 18px",
                                    fontSize: "15px",
                                    borderRadius: "12px",
                                    border: statusError ? "2px solid #dc3545" : "2px solid rgba(255,255,255,0.3)",
                                    background: "rgba(255,255,255,0.7)",
                                    fontWeight: "600",
                                    flex: "1",
                                    minWidth: "200px",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value={order.status}>{order.status} (current)</option>
                                {validStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            <button
                                onClick={handleStatusUpdate}
                                disabled={newStatus === order.status || !!statusError}
                                style={{
                                    padding: "14px 32px",
                                    fontSize: "16px",
                                    background: (newStatus === order.status || statusError)
                                        ? "#ccc"
                                        : "linear-gradient(135deg, #4CAF50, #45a049)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: (newStatus === order.status || statusError) ? "not-allowed" : "pointer",
                                    fontWeight: "700",
                                    boxShadow: (newStatus === order.status || statusError)
                                        ? "none"
                                        : "0 4px 15px rgba(76,175,80,0.3)",
                                    transition: "all 0.3s"
                                }}
                                title={statusError || "Update order status"}
                            >
                                Update Status
                            </button>
                        </div>

                        {/* Inline status validation error */}
                        {statusError && (
                            <p style={{ color: "#dc3545", fontSize: 14, marginTop: 12 }}>
                                {statusError}
                            </p>
                        )}

                        {updateMsg && (
                            <div style={{
                                marginTop: "16px",
                                padding: "14px 18px",
                                background: updateMsg.includes("successfully")
                                    ? "rgba(76,175,80,0.2)"
                                    : "rgba(220,53,69,0.2)",
                                color: updateMsg.includes("successfully") ? "#4CAF50" : "#dc3545",
                                borderRadius: "12px",
                                fontWeight: "600",
                                border: `2px solid ${updateMsg.includes("successfully") ? "#4CAF50" : "#dc3545"}`
                            }}>
                                {updateMsg}
                            </div>
                        )}
                    </div>
                )}

                {/* Note for completed orders */}
                {(role === "ADMIN" || role === "VENDOR") && validStatuses.length === 0 && (
                    <div style={{
                        padding: "20px",
                        background: "rgba(255,193,7,0.1)",
                        border: "2px solid #FFA500",
                        borderRadius: "16px",
                        color: "#856404",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <span style={{ fontSize: "24px" }}>ℹ️</span>
                        <span>
                            This order is <strong>{order.status}</strong> and cannot be updated further.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Components
const InfoItem = ({ label, value, gradient = false }) => (
    <div>
        <div style={{ fontSize: "12px", color: "#666", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
            {label}
        </div>
        <div style={{
            fontSize: "18px",
            fontWeight: "700",
            ...(gradient ? {
                background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            } : {
                color: "#1A1A2E"
            })
        }}>
            {value}
        </div>
    </div>
);

const tableHeaderStyle = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
};

const tableCellStyle = {
    padding: "16px",
    borderRadius: "8px",
    fontSize: "15px",
    color: "#1A1A2E"
};
