import { useEffect, useState } from "react";
import API from "../api";

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminNote, setAdminNote] = useState({});

    useEffect(() => {
        fetchPendingReviews();
    }, []);

    function fetchPendingReviews() {
        API.get("/reviews/pending")
            .then(res => setReviews(res.data))
            .catch(() => console.error("Failed to load reviews"))
            .finally(() => setLoading(false));
    }

    const handleApprove = async (id) => {
        try {
            await API.patch(`/reviews/${id}/approve`, {
                adminNote: adminNote[id] || ""
            });
            setReviews(reviews.filter(r => r.id !== id));
            setAdminNote({ ...adminNote, [id]: "" });
        } catch (err) {
            alert("Failed to approve review.");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this review?")) return;

        try {
            await API.delete(`/reviews/${id}/reject`, {
                data: { adminNote: adminNote[id] || "Review rejected by admin" }
            });
            setReviews(reviews.filter(r => r.id !== id));
            setAdminNote({ ...adminNote, [id]: "" });
        } catch (err) {
            alert("Failed to reject review.");
        }
    };

    const renderStars = (rating) => "⭐".repeat(rating) + "☆".repeat(5 - rating);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            <h2>Pending Reviews ({reviews.length})</h2>

            {reviews.length === 0 ? (
                <p>No pending reviews.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {reviews.map(review => (
                        <div key={review.id} style={{
                            backgroundColor: "#fff",
                            border: "2px solid #ffc107",
                            borderRadius: "8px",
                            padding: "20px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                <div>
                                    <div style={{ fontSize: "24px", color: "#FFD700" }}>{renderStars(review.rating)}</div>
                                    <p><b>Product ID:</b> {review.productId}</p>
                                    <small style={{ color: "#666" }}>{review.userEmail} • {new Date(review.createdAt).toLocaleDateString()}</small>
                                </div>
                            </div>

                            <div style={{
                                backgroundColor: "#f5f5f5",
                                padding: "15px",
                                borderRadius: "5px",
                                marginBottom: "15px"
                            }}>
                                <p><b>Comment:</b></p>
                                <p>{review.comment || <i>No comment provided</i>}</p>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label><b>Admin Note (Optional):</b></label>
                                <textarea
                                    value={adminNote[review.id] || ""}
                                    onChange={(e) => setAdminNote({ ...adminNote, [review.id]: e.target.value })}
                                    rows="2"
                                    placeholder="Add a note to this review..."
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "5px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc"
                                    }}
                                />
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() => handleApprove(review.id)}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ✓ Approve
                                </button>
                                <button
                                    onClick={() => handleReject(review.id)}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ✗ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
