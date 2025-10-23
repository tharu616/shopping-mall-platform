import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ReviewList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [text, setText] = useState("");
    const [msg, setMsg] = useState("");
    const { role, user } = useAuth();
    const [rating, setRating] = useState(5);

    function fetchReviews() {
        API.get(`/api/products/${productId}/reviews`)
            .then(res => setReviews(res.data));
    }

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line
    }, [productId]);

    async function handleAdd(e) {
        e.preventDefault();
        try {
            await API.post(`/api/products/${productId}/reviews`, {
                productId: productId,
                rating: rating,
                comment: text
            });
            setText("");
            setRating(5);
            setMsg("Review added!");
            fetchReviews();
        } catch {
            setMsg("Failed to add review.");
        }
    }

    async function handleDelete(id) {
        await API.delete(`/api/reviews/${id}`);
        fetchReviews();
    }

    return (
        <div
            style={{
                background: "linear-gradient(135deg, rgba(52,80,161,0.18), rgba(205,97,246,0.12) 100%)",
                borderRadius: "24px",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(52,80,161,0.09)",
                border: "1px solid rgba(52,80,161,0.14)",
                padding: "36px 32px",
                marginBottom: "42px",
                marginTop: "12px"
            }}
        >
            <h3 style={{
                color: "#3450a1",
                fontWeight: "800",
                fontSize: "22px",
                marginBottom: "28px"
            }}>Reviews & Ratings</h3>
            {reviews.length === 0 && (
                <div style={{
                    color: "#666",
                    fontSize: "16px",
                    padding: "18px 0",
                    fontWeight: 600
                }}>No reviews yet.</div>
            )}
            <div style={{marginBottom: "20px"}}>
                {reviews.map(r => (
                    <div key={r.id}
                         style={{
                             background: "linear-gradient(120deg, rgba(255,255,255,0.62) 90%, rgba(205,97,246,0.13))",
                             borderRadius: "16px",
                             padding: "24px",
                             marginBottom: "18px",
                             boxShadow: "0 4px 24px rgba(205,97,246,0.08)",
                             border: "1px solid rgba(205,97,246,0.08)",
                             display: "flex",
                             justifyContent: "space-between",
                             alignItems: "center"
                         }}
                    >
                        <div>
                            <span style={{
                                fontWeight: "700",
                                color: "#3450a1",
                                marginRight: "14px"
                            }}>
                                {r.userName || "Anonymous"}
                            </span>
                            <span style={{
                                fontSize: "15px",
                                color: "#666"
                            }}>
                                {r.comment}
                            </span>
                            <span style={{
                                marginLeft: "12px",
                                color: "#FFC107",
                                fontWeight: "700",
                                fontSize: "15px"
                            }}>
                                {r.rating} ⭐
                            </span>
                        </div>
                        {(role === "ADMIN" || r.userId === user?.id) && (
                            <button
                                onClick={() => handleDelete(r.id)}
                                style={{
                                    background: "rgba(220,53,69,0.15)",
                                    color: "#dc3545",
                                    padding: "6px 16px",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    border: "none",
                                    cursor: "pointer"
                                }}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {(role === "CUSTOMER" || role === "ADMIN") && (
                <form onSubmit={handleAdd} style={{
                    background: "linear-gradient(120deg, rgba(52,80,161,0.07) 60%, rgba(205,97,246,0.07))",
                    borderRadius: "18px",
                    padding: "22px",
                    boxShadow: "0 2px 20px rgba(52,80,161,0.06)",
                    marginTop: "32px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "center"
                }}>
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Write your review here..."
                        style={{
                            flex: 1,
                            border: "1.5px solid rgba(52,80,161,0.25)",
                            borderRadius: "10px",
                            padding: "10px 16px",
                            fontSize: "16px",
                            background: "rgba(255,255,255,0.7)",
                            fontWeight: "600",
                            outline: "none"
                        }}
                    />
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <label style={{ fontWeight: "600", color: "#3450a1" }}>Rating:</label>
                        <select
                            value={rating}
                            onChange={e => setRating(Number(e.target.value))}
                            style={{
                                borderRadius: "8px",
                                fontWeight: "700",
                                padding: "7px 10px",
                                border: "1.5px solid rgba(52,80,161,0.17)",
                                background: "rgba(255,255,255,0.7)",
                                color: "#3450a1"
                            }}
                        >
                            {[5,4,3,2,1].map(star => (
                                <option key={star} value={star}>{star} ⭐</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" style={{
                        background: "linear-gradient(135deg, #3450a1, #cd61f6)",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "15px",
                        borderRadius: "10px",
                        padding: "10px 24px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 12px rgba(52,80,161,0.13)"
                    }}>
                        Add Review
                    </button>
                </form>
            )}
            {msg && (
                <div style={{
                    marginTop: "14px",
                    background: msg === "Review added!" ? "rgba(76,175,80,0.18)" : "rgba(220,53,69,0.15)",
                    color: msg === "Review added!" ? "#4CAF50" : "#dc3545",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "15px",
                    border: `2px solid ${msg === "Review added!" ? "#4CAF50" : "#dc3545"}`,
                    textAlign: "center"
                }}>
                    {msg}
                </div>
            )}
        </div>
    );
}
