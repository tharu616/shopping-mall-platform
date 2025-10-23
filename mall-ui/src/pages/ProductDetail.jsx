import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ProductDetail() {
    const { id } = useParams();
    const { role, token } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [msg, setMsg] = useState("");

    // ✅ Review states
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMsg, setReviewMsg] = useState("");

    useEffect(() => {
        loadProduct();
        loadReviews();
    }, [id]);

    async function loadProduct() {
        try {
            const res = await API.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function loadReviews() {
        try {
            const res = await API.get(`/reviews/product/${id}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to load reviews", err);
        }
    }

    async function addToCart() {
        try {
            await API.post("/cart/items", {
                productId: parseInt(id),
                quantity: quantity
            });
            setMsg("✓ Added to cart successfully!");
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            console.error("Cart error:", err.response?.data || err.message);
            const errorMsg = err.response?.data?.message || "Failed to add to cart";
            setMsg(`❌ ${errorMsg}`);
            setTimeout(() => setMsg(""), 5000);
        }
    }

    // ✅ Submit Review Function
    async function handleReviewSubmit(e) {
        e.preventDefault();

        if (!token) {
            setReviewMsg("Please login to submit a review");
            return;
        }

        setSubmittingReview(true);
        setReviewMsg("");

        try {
            await API.post("/reviews", {
                productId: parseInt(id),
                rating: rating,
                comment: comment.trim()
            });
            setReviewMsg("✓ Review submitted! It will appear after admin approval.");
            setRating(5);
            setComment("");
            setTimeout(() => {
                setReviewMsg("");
                loadReviews();
            }, 3000);
        } catch (err) {
            console.error("Review error:", err.response?.data || err);
            setReviewMsg("❌ Failed to submit review. " + (err.response?.data?.message || ""));
        } finally {
            setSubmittingReview(false);
        }
    }

    const getStars = (r) => {
        return "⭐".repeat(r) + "☆".repeat(5 - r);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)"
            }}>
                <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#666"
                }}>
                    ⏳ Loading product...
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)"
            }}>
                <div style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    padding: "40px",
                    borderRadius: "24px",
                    textAlign: "center",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>❌</div>
                    <h2 style={{ fontSize: "24px", color: "#dc3545" }}>Product Not Found</h2>
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
                {/* Back Button */}
                <button
                    onClick={() => navigate("/products")}
                    style={{
                        padding: "12px 24px",
                        background: "rgba(255,255,255,0.9)",
                        border: "2px solid rgba(30,144,255,0.3)",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1A1A2E",
                        cursor: "pointer",
                        marginBottom: "30px",
                        transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = "#1E90FF";
                        e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.9)";
                        e.target.style.color = "#1A1A2E";
                    }}
                >
                    ← Back to Products
                </button>

                {/* Product Detail Card */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    marginBottom: "30px"
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "40px",
                        alignItems: "start"
                    }}>
                        {/* Product Image */}
                        <div>
                            {product.imageUrl ? (
                                <img
                                    src={`http://localhost:8081${product.imageUrl}`}
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        maxHeight: "500px",
                                        objectFit: "cover",
                                        borderRadius: "20px",
                                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "500px",
                                    background: "linear-gradient(135deg, rgba(30,144,255,0.1), rgba(75,54,139,0.1))",
                                    borderRadius: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "120px",
                                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
                                }}>
                                    📦
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 style={{
                                fontSize: "36px",
                                fontWeight: "800",
                                color: "#1A1A2E",
                                marginBottom: "16px",
                                lineHeight: "1.2"
                            }}>
                                {product.name}
                            </h1>

                            <div style={{
                                fontSize: "42px",
                                fontWeight: "800",
                                background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: "24px"
                            }}>
                                ${product.price?.toFixed(2)}
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                {product.stock > 0 ? (
                                    <span style={{
                                        padding: "8px 16px",
                                        background: "rgba(76,175,80,0.15)",
                                        color: "#4CAF50",
                                        borderRadius: "10px",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        border: "2px solid #4CAF50"
                                    }}>
                                        ✓ In Stock ({product.stock} available)
                                    </span>
                                ) : (
                                    <span style={{
                                        padding: "8px 16px",
                                        background: "rgba(220,53,69,0.15)",
                                        color: "#dc3545",
                                        borderRadius: "10px",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        border: "2px solid #dc3545"
                                    }}>
                                        ✗ Out of Stock
                                    </span>
                                )}
                            </div>

                            <div style={{
                                padding: "20px",
                                background: "linear-gradient(135deg, rgba(30,144,255,0.05), rgba(75,54,139,0.05))",
                                borderRadius: "16px",
                                marginBottom: "24px",
                                border: "1px solid rgba(30,144,255,0.1)"
                            }}>
                                <h3 style={{
                                    fontSize: "16px",
                                    fontWeight: "800",
                                    color: "#1A1A2E",
                                    marginBottom: "12px"
                                }}>
                                    📝 Description
                                </h3>
                                <p style={{
                                    fontSize: "15px",
                                    color: "#666",
                                    lineHeight: "1.6",
                                    margin: 0
                                }}>
                                    {product.description}
                                </p>
                            </div>

                            {product.sku && (
                                <div style={{
                                    padding: "16px",
                                    background: "rgba(0,0,0,0.03)",
                                    borderRadius: "12px",
                                    marginBottom: "24px"
                                }}>
                                    <span style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        fontWeight: "600"
                                    }}>
                                        SKU: <strong style={{ color: "#1A1A2E" }}>{product.sku}</strong>
                                    </span>
                                </div>
                            )}

                            {product.stock > 0 && (
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={{
                                        display: "block",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "#1A1A2E",
                                        marginBottom: "12px"
                                    }}>
                                        🔢 Quantity
                                    </label>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                background: "rgba(30,144,255,0.1)",
                                                border: "2px solid #1E90FF",
                                                borderRadius: "12px",
                                                fontSize: "24px",
                                                fontWeight: "800",
                                                color: "#1E90FF",
                                                cursor: "pointer",
                                                transition: "all 0.3s"
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            style={{
                                                width: "80px",
                                                height: "48px",
                                                textAlign: "center",
                                                fontSize: "18px",
                                                fontWeight: "800",
                                                border: "2px solid rgba(30,144,255,0.3)",
                                                borderRadius: "12px",
                                                background: "rgba(255,255,255,0.9)",
                                                outline: "none"
                                            }}
                                        />
                                        <button
                                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                background: "rgba(30,144,255,0.1)",
                                                border: "2px solid #1E90FF",
                                                borderRadius: "12px",
                                                fontSize: "24px",
                                                fontWeight: "800",
                                                color: "#1E90FF",
                                                cursor: "pointer",
                                                transition: "all 0.3s"
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {product.stock > 0 ? (
                                <button
                                    onClick={addToCart}
                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        boxShadow: "0 8px 24px rgba(76,175,80,0.4)",
                                        transition: "all 0.3s",
                                        marginBottom: "16px"
                                    }}
                                >
                                    🛒 Add to Cart
                                </button>
                            ) : (
                                <button
                                    disabled
                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        background: "#ccc",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        cursor: "not-allowed",
                                        marginBottom: "16px"
                                    }}
                                >
                                    ✗ Out of Stock
                                </button>
                            )}

                            {(role === "VENDOR" || role === "ADMIN") && (
                                <button
                                    onClick={() => navigate(`/products/${id}/edit`)}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 16px rgba(30,144,255,0.3)"
                                    }}
                                >
                                    ✏️ Edit Product
                                </button>
                            )}

                            {msg && (
                                <div style={{
                                    marginTop: "20px",
                                    padding: "16px 20px",
                                    borderRadius: "12px",
                                    background: msg.includes("✓")
                                        ? "rgba(76,175,80,0.15)"
                                        : "rgba(220,53,69,0.15)",
                                    color: msg.includes("✓") ? "#4CAF50" : "#dc3545",
                                    fontWeight: "700",
                                    fontSize: "15px",
                                    border: `2px solid ${msg.includes("✓") ? "#4CAF50" : "#dc3545"}`,
                                    textAlign: "center"
                                }}>
                                    {msg}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ✅ REVIEWS SECTION */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "30px"
                    }}>
                        ⭐ Reviews & Ratings
                    </h2>

                    {/* Write Review Form (only if logged in) */}
                    {token && (
                        <form onSubmit={handleReviewSubmit} style={{
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
                                    Rating: {getStars(rating)}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    style={{
                                        width: "100%",
                                        cursor: "pointer",
                                        accentColor: "#1E90FF"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    marginBottom: "8px"
                                }}>
                                    Comment:
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    placeholder="Share your experience with this product..."
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
                                disabled={submittingReview}
                                style={{
                                    padding: "12px 24px",
                                    background: submittingReview ? "#ccc" : "#1E90FF",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    cursor: submittingReview ? "not-allowed" : "pointer"
                                }}
                            >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>

                            {reviewMsg && (
                                <div style={{
                                    marginTop: "16px",
                                    padding: "12px",
                                    background: reviewMsg.includes("✓") ? "#d4edda" : "#f8d7da",
                                    color: reviewMsg.includes("✓") ? "#155724" : "#721c24",
                                    borderRadius: "8px",
                                    fontWeight: "700"
                                }}>
                                    {reviewMsg}
                                </div>
                            )}
                        </form>
                    )}

                    {/* Reviews List */}
                    <div style={{ display: "grid", gap: "20px" }}>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div
                                    key={review.id}
                                    style={{
                                        padding: "20px",
                                        background: "white",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        border: "1px solid rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "12px"
                                    }}>
                                        <div>
                                            <div style={{ fontSize: "18px", marginBottom: "4px" }}>
                                                {getStars(review.rating)}
                                            </div>
                                            <div style={{ fontWeight: "700", color: "#1A1A2E" }}>
                                                {review.userName || "Anonymous"}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "14px", color: "#999" }}>
                                            {review.createdAt}
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: "15px",
                                        color: "#666",
                                        lineHeight: "1.6",
                                        margin: 0
                                    }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                textAlign: "center",
                                padding: "60px 20px",
                                color: "#999"
                            }}>
                                <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
                                <p style={{ fontSize: "18px", fontWeight: "600" }}>
                                    No reviews yet. Be the first to review!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
