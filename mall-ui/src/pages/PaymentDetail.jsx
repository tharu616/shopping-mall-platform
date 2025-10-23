import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function PaymentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [actionMsg, setActionMsg] = useState("");

    useEffect(() => {
        fetchPayment();
    }, [id]);

    function fetchPayment() {
        API.get(`/payments/${id}`)
            .then(res => setPayment(res.data))
            .catch(() => setError("Payment not found."))
            .finally(() => setLoading(false));
    }

    const handleApprove = async () => {
        setActionMsg("");
        try {
            await API.patch(`/payments/${id}/approve`, { adminNote });
            setActionMsg("Payment approved successfully!");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) {
            setActionMsg(err.response?.data?.message || "Failed to approve payment.");
        }
    };

    const handleReject = async () => {
        if (!adminNote.trim()) {
            setActionMsg("Please provide a reason for rejection.");
            return;
        }

        setActionMsg("");
        try {
            await API.patch(`/payments/${id}/reject`, { adminNote });
            setActionMsg("Payment rejected.");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) {
            setActionMsg(err.response?.data?.message || "Failed to reject payment.");
        }
    };

    const getStatusStyle = (status) => {
        const styles = {
            VERIFIED: { color: "#4CAF50", bg: "rgba(76,175,80,0.15)", icon: "✓" },
            REJECTED: { color: "#dc3545", bg: "rgba(220,53,69,0.15)", icon: "✗" },
            PENDING: { color: "#FFA500", bg: "rgba(255,165,0,0.15)", icon: "⏳" }
        };
        return styles[status] || { color: "#6c757d", bg: "rgba(108,117,125,0.15)", icon: "?" };
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
                    Loading payment details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)"
            }}>
                <div style={{
                    background: "rgba(220,53,69,0.2)",
                    backdropFilter: "blur(20px)",
                    padding: "40px 60px",
                    borderRadius: "20px",
                    border: "2px solid #dc3545",
                    color: "white",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>⚠️</div>
                    <h2>{error}</h2>
                </div>
            </div>
        );
    }

    if (!payment) return null;

    const statusStyle = getStatusStyle(payment.status);

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: "30px" }}>
                    <Link to="/payments" style={{
                        color: "#1E90FF",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        ← Back to Payments
                    </Link>
                </div>

                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                    flexWrap: "wrap",
                    gap: "20px"
                }}>
                    <h1 style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#1A1A2E"
                    }}>
                        💳 Payment Review #{payment.id}
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
                            {payment.status}
                        </span>
                    </div>
                </div>

                {/* Payment Details - Glassmorphism */}
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
                        Payment Information
                    </h3>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px"
                    }}>
                        <InfoItem label="Order ID" value={
                            <Link to={`/orders/${payment.orderId}`} style={{
                                color: "#1E90FF",
                                textDecoration: "none",
                                fontWeight: "700"
                            }}>
                                #{payment.orderId}
                            </Link>
                        } />
                        <InfoItem label="User Email" value={payment.userEmail} />
                        <InfoItem label="Amount" value={`$${payment.amount}`} gradient={true} />
                        <InfoItem label="Reference" value={payment.reference || 'N/A'} />
                        <InfoItem label="Payment Method" value={payment.paymentMethod || 'N/A'} />
                    </div>

                    {payment.adminNote && (
                        <div style={{
                            marginTop: "20px",
                            padding: "16px",
                            background: "rgba(30,144,255,0.05)",
                            borderRadius: "12px",
                            borderLeft: "4px solid #1E90FF"
                        }}>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#1E90FF", marginBottom: "6px" }}>
                                Admin Note:
                            </div>
                            <div style={{ color: "#666", lineHeight: "1.6" }}>
                                {payment.adminNote}
                            </div>
                        </div>
                    )}
                </div>

                {/* Receipt Display - Glassmorphism */}
                {payment.receiptUrl && (
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
                            📄 Payment Receipt
                        </h3>

                        <div style={{
                            background: "linear-gradient(135deg, rgba(30,144,255,0.05), rgba(75,54,139,0.05))",
                            borderRadius: "16px",
                            padding: "20px",
                            textAlign: "center",
                            border: "2px dashed rgba(30,144,255,0.3)"
                        }}>
                            {payment.receiptUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img
                                    src={payment.receiptUrl}
                                    alt="Payment Receipt"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "500px",
                                        borderRadius: "12px",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                                    }}
                                />
                            ) : (
                                <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                    <button style={{
                                        padding: "14px 32px",
                                        background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        boxShadow: "0 4px 15px rgba(30,144,255,0.3)",
                                        transition: "all 0.3s"
                                    }}>
                                        📥 View Receipt (PDF/Document)
                                    </button>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Admin Review Section - Glassmorphism */}
                {payment.status === "PENDING" && (
                    <div style={{
                        background: "linear-gradient(135deg, rgba(30,144,255,0.1), rgba(75,54,139,0.1))",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "2px solid rgba(30,144,255,0.3)",
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
                            🔍 Admin Review
                        </h3>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                            Review the payment details and receipt above, then approve or reject this payment submission.
                        </p>

                        <label style={{
                            display: "block",
                            marginBottom: "20px"
                        }}>
                            <span style={{
                                display: "block",
                                fontWeight: "700",
                                color: "#1A1A2E",
                                marginBottom: "10px",
                                fontSize: "15px"
                            }}>
                                Admin Note <span style={{ color: "#666", fontWeight: "normal" }}>(Optional for Approve, Required for Reject)</span>
                            </span>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                rows="4"
                                placeholder="Add a note for the customer..."
                                style={{
                                    width: "100%",
                                    padding: "14px 18px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(30,144,255,0.3)",
                                    background: "rgba(255,255,255,0.7)",
                                    fontSize: "15px",
                                    resize: "vertical",
                                    fontFamily: "inherit",
                                    outline: "none"
                                }}
                            />
                        </label>

                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <button
                                onClick={handleApprove}
                                style={{
                                    flex: 1,
                                    minWidth: "200px",
                                    padding: "16px 32px",
                                    background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    boxShadow: "0 4px 15px rgba(76,175,80,0.3)",
                                    transition: "all 0.3s"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(76,175,80,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 15px rgba(76,175,80,0.3)";
                                }}
                            >
                                ✓ Approve Payment
                            </button>
                            <button
                                onClick={handleReject}
                                style={{
                                    flex: 1,
                                    minWidth: "200px",
                                    padding: "16px 32px",
                                    background: "linear-gradient(135deg, #dc3545, #c82333)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    boxShadow: "0 4px 15px rgba(220,53,69,0.3)",
                                    transition: "all 0.3s"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(220,53,69,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 15px rgba(220,53,69,0.3)";
                                }}
                            >
                                ✗ Reject Payment
                            </button>
                        </div>

                        {actionMsg && (
                            <div style={{
                                marginTop: "20px",
                                padding: "16px 20px",
                                borderRadius: "12px",
                                background: actionMsg.includes("success") || actionMsg.includes("approved")
                                    ? "rgba(76,175,80,0.15)"
                                    : "rgba(220,53,69,0.15)",
                                color: actionMsg.includes("success") || actionMsg.includes("approved")
                                    ? "#4CAF50"
                                    : "#dc3545",
                                fontWeight: "700",
                                textAlign: "center",
                                fontSize: "16px",
                                border: `2px solid ${actionMsg.includes("success") || actionMsg.includes("approved") ? "#4CAF50" : "#dc3545"}`
                            }}>
                                {actionMsg}
                            </div>
                        )}
                    </div>
                )}

                {/* Already Processed Notice */}
                {payment.status !== "PENDING" && (
                    <div style={{
                        padding: "20px",
                        border: "2px solid #FFA500",
                        borderRadius: "16px",
                        background: "rgba(255,165,0,0.1)",
                        color: "#1A1A2E",
                        textAlign: "center",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        fontSize: "16px"
                    }}>
                        <span style={{ fontSize: "24px" }}>ℹ️</span>
                        <span>
                            This payment has already been <span style={{ color: statusStyle.color }}>{payment.status.toLowerCase()}</span>.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Component
const InfoItem = ({ label, value, gradient = false }) => (
    <div style={{
        padding: "16px",
        background: "rgba(30,144,255,0.05)",
        borderRadius: "12px",
        border: "1px solid rgba(30,144,255,0.1)"
    }}>
        <div style={{
            fontSize: "12px",
            color: "#666",
            fontWeight: "600",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
        }}>
            {label}
        </div>
        <div style={{
            fontSize: "16px",
            fontWeight: "700",
            ...(gradient ? {
                background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "20px"
            } : {
                color: "#1A1A2E"
            })
        }}>
            {value}
        </div>
    </div>
);
