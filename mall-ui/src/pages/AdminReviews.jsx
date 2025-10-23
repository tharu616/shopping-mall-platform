import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminReviews() {
    const { role } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (role !== "ADMIN") {
            navigate("/");
            return;
        }
        fetchReviews();
    }, [role, navigate]);

    async function fetchReviews() {
        setLoading(true);
        try {
            const res = await API.get("/api/reviews/admin/all");
            setReviews(res.data);
        } catch (err) {
            setMsg("Failed to load reviews");
        }
        setLoading(false);
    }

    async function handleAction(reviewId, action) {
        try {
            await API.put(`/api/reviews/admin/${reviewId}/action`, { action });
            setMsg(`✓ Review ${action === "APPROVE" ? "approved" : "rejected"} successfully`);
            fetchReviews();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("❌ Action failed");
        }
    }

    async function handleDelete(reviewId) {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await API.delete(`/api/reviews/admin/${reviewId}`);
            setMsg("✓ Review deleted successfully");
            fetchReviews();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("❌ Failed to delete review");
        }
    }

    const getStars = (rating) => {
        return "⭐".repeat(rating) + "☆".repeat(5 - rating);
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: { bg: "#FFA500", text: "Pending" },
            APPROVED: { bg: "#4CAF50", text: "Approved" },
            REJECTED: { bg: "#dc3545", text: "Rejected" }
        };
        const style = styles[status] || styles.PENDING;
        return (
            <span style={{
                padding: "6px 12px",
                background: style.bg,
                color: "white",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700"
            }}>
                {style.text}
            </span>
        );
    };

    const filteredReviews = reviews.filter(r => {
        if (filter === "all") return true;
        return r.status === filter.toUpperCase();
    });

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
                    ⏳ Loading reviews...
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
                <h1 style={{
                    fontSize: "42px",
                    fontWeight: "800",
                    color: "#1A1A2E",
                    marginBottom: "30px",
                    textAlign: "center"
                }}>
                    ⭐ Review Management
                </h1>

                {/* Filter Tabs */}
                <div style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "30px",
                    justifyContent: "center"
                }}>
                    {["all", "pending", "approved", "rejected"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: "12px 24px",
                                background: filter === f
                                    ? "linear-gradient(135deg, #1E90FF, #4B368B)"
                                    : "#fff",
                                color: filter === f ? "white" : "#666",
                                border: "2px solid #1E90FF",
                                borderRadius: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                                textTransform: "capitalize"
                            }}
                        >
                            {f} ({reviews.filter(r => f === "all" || r.status === f.toUpperCase()).length})
                        </button>
                    ))}
                </div>

                {msg && (
                    <div style={{
                        padding: "16px",
                        background: msg.includes("✓") ? "#d4edda" : "#f8d7da",
                        color: msg.includes("✓") ? "#155724" : "#721c24",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        fontWeight: "700",
                        textAlign: "center"
                    }}>
                        {msg}
                    </div>
                )}

                {/* Reviews List */}
                <div style={{ display: "grid", gap: "20px" }}>
                    {filteredReviews.map(review => (
                        <div
                            key={review.id}
                            style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                borderRadius: "16px",
                                padding: "24px",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "16px"
                            }}>
                                <div>
                                    <h3 style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "#1A1A2E",
                                        marginBottom: "8px"
                                    }}>
                                        {review.productName}
                                    </h3>
                                    <div style={{
                                        fontSize: "24px",
                                        marginBottom: "8px"
                                    }}>
                                        {getStars(review.rating)}
                                    </div>
                                    <p style={{
                                        color: "#666",
                                        fontSize: "14px",
                                        marginBottom: "4px"
                                    }}>
                                        <strong>By:</strong> {review.userName}
                                    </p>
                                    <p style={{
                                        color: "#666",
                                        fontSize: "14px"
                                    }}>
                                        <strong>Date:</strong> {review.createdAt}
                                    </p>
                                </div>
                                <div>
                                    {getStatusBadge(review.status)}
                                </div>
                            </div>

                            {review.comment && (
                                <p style={{
                                    color: "#444",
                                    fontSize: "15px",
                                    lineHeight: "1.6",
                                    marginBottom: "16px",
                                    padding: "12px",
                                    background: "rgba(30,144,255,0.05)",
                                    borderRadius: "8px"
                                }}>
                                    "{review.comment}"
                                </p>
                            )}

                            {/* Actions */}
                            <div style={{
                                display: "flex",
                                gap: "12px"
                            }}>
                                {review.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() => handleAction(review.id, "APPROVE")}
                                            style={{
                                                padding: "10px 20px",
                                                background: "#4CAF50",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                                fontWeight: "700",
                                                cursor: "pointer"
                                            }}
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(review.id, "REJECT")}
                                            style={{
                                                padding: "10px 20px",
                                                background: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                                fontWeight: "700",
                                                cursor: "pointer"
                                            }}
                                        >
                                            ✗ Reject
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    style={{
                                        padding: "10px 20px",
                                        background: "#6c757d",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "700",
                                        cursor: "pointer"
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredReviews.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#666",
                        fontSize: "18px"
                    }}>
                        No reviews found
                    </div>
                )}
            </div>
        </div>
    );
}
