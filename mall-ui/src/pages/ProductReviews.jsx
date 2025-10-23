import { useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ProductReviews({ productId, reviews, onReviewAdded }) {
    const { token } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!token) {
            setMsg("Please login to submit a review");
            return;
        }

        setSubmitting(true);
        setMsg("");

        try {
            await API.post("/reviews", {
                productId,
                rating,
                comment: comment.trim()
            });
            setMsg("✓ Review submitted! It will appear after admin approval.");
            setRating(5);
            setComment("");
            if (onReviewAdded) onReviewAdded();
            setTimeout(() => setMsg(""), 5000);
        } catch (err) {
            setMsg("❌ Failed to submit review");
        }
        setSubmitting(false);
    }

    const getStars = (r) => {
        return "⭐".repeat(r) + "☆".repeat(5 - r);
    };

    return (
        <div style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "24px",
            padding: "40px",
            marginTop: "30px"
        }}>
            <h2 style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#1A1A2E",
                marginBottom: "24px"
            }}>
                ⭐ Customer Reviews
            </h2>

            {/* Submit Review Form */}
            {token && (
                <form onSubmit={handleSubmit} style={{
                    marginBottom: "40px",
                    padding: "24px",
                    background: "rgba(30,144,255,0.05)",
                    borderRadius: "16px"
                }}>
                    <h3 style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "16px"
                    }}>
                        Write a Review
                    </h3>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            marginBottom: "8px"
                        }}>
                            Rating:
                        </label>
                        <div style={{
                            display: "flex",
                            gap: "8px"
                        }}>
                            {[1, 2, 3, 4, 5].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRating(r)}
                                    style={{
                                        fontSize: "32px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        opacity: r <= rating ? 1 : 0.3
                                    }}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            marginBottom: "8px"
                        }}>
                            Comment (optional):
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            placeholder="Share your experience..."
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "2px solid rgba(30,144,255,0.3)",
                                fontSize: "15px",
                                fontFamily: "inherit",
                                resize: "vertical"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            padding: "12px 24px",
                            background: submitting ? "#ccc" : "#1E90FF",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "700",
                            cursor: submitting ? "not-allowed" : "pointer"
                        }}
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>

                    {msg && (
                        <div style={{
                            marginTop: "16px",
                            padding: "12px",
                            background: msg.includes("✓") ? "#d4edda" : "#f8d7da",
                            color: msg.includes("✓") ? "#155724" : "#721c24",
                            borderRadius: "8px",
                            fontWeight: "700"
                        }}>
                            {msg}
                        </div>
                    )}
                </form>
            )}

            {/* Reviews List */}
            <div style={{ display: "grid", gap: "20px" }}>
                {reviews && reviews.length > 0 ? (
                    reviews.map(review => (
                        <div
                            key={review.id}
                            style={{
                                padding: "20px",
                                background: "white",
                                borderRadius: "12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "12px"
                            }}>
                                <div>
                                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                                        {getStars(review.rating)}
                                    </div>
                                    <p style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        fontWeight: "600"
                                    }}>
                                        {review.userName}
                                    </p>
                                </div>
                                <p style={{
                                    fontSize: "13px",
                                    color: "#999"
                                }}>
                                    {review.createdAt}
                                </p>
                            </div>
                            {review.comment && (
                                <p style={{
                                    color: "#444",
                                    fontSize: "15px",
                                    lineHeight: "1.6"
                                }}>
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{
                        textAlign: "center",
                        color: "#666",
                        padding: "40px 0"
                    }}>
                        No reviews yet. Be the first to review!
                    </p>
                )}
            </div>
        </div>
    );
}
