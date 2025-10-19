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

    // Status transition rules (matches your backend)
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

    async function handleStatusUpdate() {
        setUpdateMsg("");

        if (!newStatus || newStatus === order.status) {
            setUpdateMsg("Please select a different status.");
            return;
        }

        try {
            const response = await API.patch(`/orders/${id}/status`, {
                status: newStatus
            });

            setUpdateMsg("Status updated successfully!");

            // Refresh and navigate back after 1 second
            setTimeout(() => {
                navigate("/orders");
            }, 1000);

        } catch (err) {
            console.error("Update error:", err);
            const errorMsg = err.response?.data?.message || err.response?.data || "Failed to update status.";
            setUpdateMsg(`Error: ${errorMsg}`);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!order) return null;

    const validStatuses = getValidNextStatuses(order.status);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Order #{order.id}</h2>

            <div style={{
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "20px"
            }}>
                <p><b>Status:</b> <span style={{
                    color: order.status === 'DELIVERED' ? 'green' :
                        order.status === 'CANCELLED' ? 'red' : 'orange',
                    fontWeight: 'bold'
                }}>{order.status}</span></p>
                <p><b>Total:</b> ${order.total}</p>
                <p><b>Shipping Address:</b> {order.shippingAddress || "N/A"}</p>
                <p><b>User Email:</b> {order.userEmail}</p>
                <p><b>Created:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
            </div>

            <h3>Items:</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <thead>
                <tr style={{ backgroundColor: "#e0e0e0" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Product</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>SKU</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Price</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Qty</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                </tr>
                </thead>
                <tbody>
                {order.items && order.items.length > 0 ? (
                    order.items.map(item => (
                        <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "10px" }}><b>{item.name}</b></td>
                            <td style={{ padding: "10px" }}>{item.sku}</td>
                            <td style={{ padding: "10px", textAlign: "right" }}>${item.price}</td>
                            <td style={{ padding: "10px", textAlign: "right" }}>{item.quantity}</td>
                            <td style={{ padding: "10px", textAlign: "right" }}><b>${item.lineTotal}</b></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>No items</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Admin/Vendor Status Update */}
            {(role === "ADMIN" || role === "VENDOR") && validStatuses.length > 0 && (
                <div style={{
                    marginTop: "20px",
                    padding: "20px",
                    border: "2px solid #4CAF50",
                    borderRadius: "8px",
                    backgroundColor: "#f9fff9"
                }}>
                    <h3>Update Order Status</h3>
                    <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                        Current status: <b>{order.status}</b>
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            style={{
                                padding: "10px",
                                fontSize: "14px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                flex: "1",
                                maxWidth: "200px"
                            }}
                        >
                            <option value={order.status}>{order.status} (current)</option>
                            {validStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleStatusUpdate}
                            disabled={newStatus === order.status}
                            style={{
                                padding: "10px 20px",
                                fontSize: "14px",
                                backgroundColor: newStatus === order.status ? "#ccc" : "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: newStatus === order.status ? "not-allowed" : "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Update Status
                        </button>
                    </div>

                    {updateMsg && (
                        <div style={{
                            marginTop: "15px",
                            padding: "12px",
                            backgroundColor: updateMsg.includes("successfully") ? "#d4edda" : "#f8d7da",
                            color: updateMsg.includes("successfully") ? "#155724" : "#721c24",
                            borderRadius: "5px",
                            fontWeight: "bold"
                        }}>
                            {updateMsg}
                        </div>
                    )}
                </div>
            )}

            {/* If order is DELIVERED or CANCELLED, show message */}
            {(role === "ADMIN" || role === "VENDOR") && validStatuses.length === 0 && (
                <div style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffc107",
                    borderRadius: "5px",
                    color: "#856404"
                }}>
                    <b>Note:</b> This order is {order.status} and cannot be updated further.
                </div>
            )}

            <br />
            <Link
                to="/orders"
                style={{
                    color: "#007bff",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: "bold"
                }}
            >
                ← Back to Orders
            </Link>
        </div>
    );
}
