import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Payments() {
    const { role } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPayments();
    }, [role]);

    function fetchPayments() {
        setLoading(true);
        const endpoint = role === "ADMIN" ? "/payments/pending" : "/payments/mine";

        API.get(endpoint)
            .then(res => setPayments(res.data))
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Failed to load payments.");
            })
            .finally(() => setLoading(false));
    }

    const getStatusStyle = (status) => {
        const styles = {
            VERIFIED: { color: "#4CAF50", bg: "rgba(76,175,80,0.1)", icon: "✓" },
            REJECTED: { color: "#dc3545", bg: "rgba(220,53,69,0.1)", icon: "✗" },
            PENDING: { color: "#FFA500", bg: "rgba(255,165,0,0.1)", icon: "⏳" }
        };
        return styles[status] || { color: "#6c757d", bg: "rgba(108,117,125,0.1)", icon: "?" };
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
                    Loading payments...
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

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                    gap: "20px"
                }}>
                    <div>
                        <h1 style={{
                            fontSize: "42px",
                            fontWeight: "800",
                            color: "#1A1A2E",
                            marginBottom: "8px"
                        }}>
                            {role === "ADMIN" ? "💰 Pending Payments" : "💳 My Payments"}
                        </h1>
                        <p style={{ color: "#666", fontSize: "16px" }}>
                            {role === "ADMIN"
                                ? "Review and approve payment submissions"
                                : "Track your payment history and status"}
                        </p>
                    </div>

                    {role === "CUSTOMER" && (
                        <Link to="/payments/upload" style={{ textDecoration: "none" }}>
                            <button style={{
                                padding: "14px 28px",
                                background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: "pointer",
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
                                + Upload New Payment
                            </button>
                        </Link>
                    )}
                </div>

                {/* Payments List */}
                {payments.length === 0 ? (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "20px",
                        padding: "80px 40px",
                        textAlign: "center",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                    }}>
                        <div style={{ fontSize: "80px", marginBottom: "24px" }}>💳</div>
                        <h3 style={{
                            fontSize: "24px",
                            color: "#666",
                            marginBottom: "12px",
                            fontWeight: "700"
                        }}>
                            No Payments Found
                        </h3>
                        <p style={{ color: "#999", fontSize: "16px" }}>
                            {role === "ADMIN"
                                ? "There are no pending payments to review"
                                : "You haven't made any payments yet"}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "20px",
                        padding: "30px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        overflowX: "auto"
                    }}>
                        <table style={{
                            width: "100%",
                            borderCollapse: "separate",
                            borderSpacing: "0 12px"
                        }}>
                            <thead>
                            <tr>
                                <th style={tableHeaderStyle}>ID</th>
                                <th style={tableHeaderStyle}>Order</th>
                                <th style={tableHeaderStyle}>Reference</th>
                                <th style={{...tableHeaderStyle, textAlign: "right"}}>Amount</th>
                                <th style={{...tableHeaderStyle, textAlign: "center"}}>Status</th>
                                {role === "CUSTOMER" && (
                                    <th style={tableHeaderStyle}>Admin Note</th>
                                )}
                                <th style={{...tableHeaderStyle, textAlign: "center"}}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map(payment => {
                                const statusStyle = getStatusStyle(payment.status);
                                return (
                                    <tr key={payment.id} style={{
                                        background: "rgba(30,144,255,0.03)",
                                        transition: "all 0.3s"
                                    }}>
                                        <td style={tableCellStyle}>
                                            <span style={{
                                                fontWeight: "700",
                                                color: "#1A1A2E"
                                            }}>
                                                #{payment.id}
                                            </span>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <Link to={`/orders/${payment.orderId}`} style={{
                                                color: "#1E90FF",
                                                textDecoration: "none",
                                                fontWeight: "600",
                                                transition: "color 0.3s"
                                            }}>
                                                Order #{payment.orderId}
                                            </Link>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <strong style={{ color: "#1A1A2E" }}>
                                                {payment.reference}
                                            </strong>
                                        </td>
                                        <td style={{...tableCellStyle, textAlign: "right"}}>
                                            <span style={{
                                                fontSize: "18px",
                                                fontWeight: "800",
                                                background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent"
                                            }}>
                                                ${payment.amount}
                                            </span>
                                        </td>
                                        <td style={{...tableCellStyle, textAlign: "center"}}>
                                            <span style={{
                                                padding: "6px 16px",
                                                borderRadius: "12px",
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                                fontWeight: "700",
                                                fontSize: "13px",
                                                border: `2px solid ${statusStyle.color}`,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px"
                                            }}>
                                                <span>{statusStyle.icon}</span>
                                                {payment.status}
                                            </span>
                                        </td>
                                        {role === "CUSTOMER" && (
                                            <td style={{...tableCellStyle, fontSize: "14px"}}>
                                                <span style={{ color: "#666", fontStyle: payment.adminNote ? "normal" : "italic" }}>
                                                    {payment.adminNote || "No note"}
                                                </span>
                                            </td>
                                        )}
                                        <td style={{...tableCellStyle, textAlign: "center"}}>
                                            {role === "ADMIN" && payment.status === "PENDING" ? (
                                                <Link to={`/payments/${payment.id}`} style={{ textDecoration: "none" }}>
                                                    <button style={{
                                                        padding: "8px 20px",
                                                        background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "10px",
                                                        fontWeight: "700",
                                                        cursor: "pointer",
                                                        fontSize: "14px",
                                                        transition: "all 0.3s",
                                                        boxShadow: "0 4px 12px rgba(30,144,255,0.3)"
                                                    }}>
                                                        Review →
                                                    </button>
                                                </Link>
                                            ) : (
                                                <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                                    <button style={{
                                                        padding: "8px 20px",
                                                        background: "#6c757d",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "10px",
                                                        fontWeight: "700",
                                                        cursor: "pointer",
                                                        fontSize: "14px",
                                                        transition: "all 0.3s"
                                                    }}>
                                                        📄 View Receipt
                                                    </button>
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Summary Stats */}
                {payments.length > 0 && (
                    <div style={{
                        marginTop: "30px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px"
                    }}>
                        <StatCard
                            icon="💰"
                            label="Total Payments"
                            value={payments.length}
                            color="#1E90FF"
                        />
                        <StatCard
                            icon="⏳"
                            label="Pending"
                            value={payments.filter(p => p.status === "PENDING").length}
                            color="#FFA500"
                        />
                        <StatCard
                            icon="✓"
                            label="Verified"
                            value={payments.filter(p => p.status === "VERIFIED").length}
                            color="#4CAF50"
                        />
                        {role === "CUSTOMER" && (
                            <StatCard
                                icon="💵"
                                label="Total Amount"
                                value={`$${payments.filter(p => p.status === "VERIFIED").reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`}
                                color="#4B368B"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Component
const StatCard = ({ icon, label, value, color }) => (
    <div style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        textAlign: "center",
        transition: "all 0.3s"
    }}
         onMouseEnter={(e) => {
             e.currentTarget.style.transform = "translateY(-5px)";
             e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
         }}
         onMouseLeave={(e) => {
             e.currentTarget.style.transform = "translateY(0)";
             e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
         }}
    >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>{icon}</div>
        <div style={{
            fontSize: "28px",
            fontWeight: "800",
            color: color,
            marginBottom: "6px"
        }}>
            {value}
        </div>
        <div style={{
            fontSize: "14px",
            color: "#666",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
        }}>
            {label}
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
