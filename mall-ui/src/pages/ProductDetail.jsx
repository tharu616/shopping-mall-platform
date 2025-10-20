import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ProductDetail() {
    const { id } = useParams();
    const { token, role } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);
    const [msg, setMsg] = useState("");

    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [reviewMsg, setReviewMsg] = useState("");

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    function fetchProduct() {
        API.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(() => setError("Product not found"))
            .finally(() => setLoading(false));
    }

    function fetchReviews() {
        API.get(`/reviews/product/${id}`)
            .then(res => setReviews(res.data))
            .catch(() => console.error("Failed to load reviews"));
    }

    async function handleDelete() {
        if (window.confirm("Delete this product?")) {
            await API.delete(`/products/${id}`);
            navigate("/products");
        }
    }

    async function handleAddToCart() {
        try {
            await API.post("/cart/items", { productId: product.id, quantity: qty });
            setMsg("✓ Added to cart!");
            setTimeout(() => setMsg(""), 3000);
        } catch {
            setMsg("Failed to add to cart.");
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await API.post("/reviews", {
                productId: parseInt(id),
                rating: newReview.rating,
                comment: newReview.comment.trim()
            });
            setReviewMsg("✓ Review submitted! Awaiting approval.");
            setNewReview({ rating: 5, comment: "" });
            setShowReviewForm(false);
            setTimeout(() => setReviewMsg(""), 5000);
        } catch (err) {
            setReviewMsg(err.response?.data?.message || "Failed to submit review.");
        }
    };

    const renderStars = (rating) => "⭐".repeat(rating) + "☆".repeat(5 - rating);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF, #4B368B)"
            }}>
                <div style={{ color: "white", fontSize: "24px", fontWeight: "600" }}>
                    Loading product...
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
                    <div style={{ fontSize: "80px", marginBottom: "20px" }}>😞</div>
                    <h2 style={{ color: "white", marginBottom: "20px", fontSize: "28px", fontWeight: "800" }}>{error}</h2>
                    <Link to="/products">
                        <button style={{
                            padding: "14px 32px",
                            background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "16px",
                            boxShadow: "0 8px 24px rgba(255,165,0,0.4)"
                        }}>
                            ← Back to Products
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)"
        }}>
            {/* Breadcrumb - Glassmorphism */}
            <div style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                padding: "20px 40px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
            }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <Link to="/products" style={{
                        color: "#1E90FF",
                        textDecoration: "none",
                        fontWeight: "700",
                        fontSize: "15px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.3s"
                    }}>
                        ← Back to Products
                    </Link>
                </div>
            </div>

            {/* Product Detail */}
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "60px 40px"
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "40px",
                    marginBottom: "40px"
                }}>
                    {/* Left: Product Image - Enhanced Glassmorphism */}
                    <div style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "24px",
                        padding: "60px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "500px",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        {/* Decorative background */}
                        <div style={{
                            position: "absolute",
                            top: "-50%",
                            left: "-50%",
                            width: "200%",
                            height: "200%",
                            background: "radial-gradient(circle, rgba(30,144,255,0.05), transparent 50%)",
                            animation: "rotate 20s linear infinite"
                        }} />
                        <div style={{ fontSize: "200px", position: "relative", zIndex: 1 }}>📦</div>
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <h1 style={{
                            fontSize: "42px",
                            fontWeight: "800",
                            color: "#1A1A2E",
                            marginBottom: "16px",
                            lineHeight: "1.2"
                        }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        {reviews.length > 0 && (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "24px"
                            }}>
                                <span style={{ fontSize: "24px" }}>{renderStars(Math.round(averageRating))}</span>
                                <span style={{ color: "#666", fontSize: "16px", fontWeight: "600" }}>
                                    {averageRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div style={{
                            fontSize: "52px",
                            fontWeight: "800",
                            background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            marginBottom: "24px",
                            lineHeight: "1"
                        }}>
                            ${product.price}
                        </div>

                        {/* Description */}
                        <p style={{
                            fontSize: "18px",
                            color: "#666",
                            lineHeight: "1.8",
                            marginBottom: "30px"
                        }}>
                            {product.description}
                        </p>

                        {/* Stock & SKU - Glassmorphism */}
                        <div style={{
                            display: "flex",
                            gap: "16px",
                            marginBottom: "30px",
                            flexWrap: "wrap"
                        }}>
                            <div style={{
                                padding: "14px 24px",
                                background: product.stock > 0
                                    ? "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05))"
                                    : "linear-gradient(135deg, rgba(220,53,69,0.15), rgba(220,53,69,0.05))",
                                backdropFilter: "blur(10px)",
                                borderRadius: "14px",
                                color: product.stock > 0 ? "#4CAF50" : "#dc3545",
                                fontWeight: "700",
                                border: `2px solid ${product.stock > 0 ? "#4CAF50" : "#dc3545"}`,
                                fontSize: "15px"
                            }}>
                                {product.stock > 0 ? `✓ ${product.stock} in stock` : "⚠ Out of Stock"}
                            </div>
                            <div style={{
                                padding: "14px 24px",
                                background: "linear-gradient(135deg, rgba(30,144,255,0.15), rgba(30,144,255,0.05))",
                                backdropFilter: "blur(10px)",
                                borderRadius: "14px",
                                color: "#1E90FF",
                                fontWeight: "700",
                                border: "2px solid #1E90FF",
                                fontSize: "15px"
                            }}>
                                SKU: {product.sku}
                            </div>
                        </div>

                        {/* Quantity Selector & Add to Cart - Glassmorphism */}
                        {token && role === "CUSTOMER" && product.stock > 0 && (
                            <div style={{
                                background: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.3)",
                                padding: "30px",
                                borderRadius: "20px",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                                marginBottom: "20px"
                            }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "12px",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    fontSize: "16px"
                                }}>
                                    Quantity:
                                </label>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={qty}
                                        onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                                        style={{
                                            width: "100px",
                                            padding: "16px",
                                            borderRadius: "12px",
                                            border: "2px solid rgba(30,144,255,0.3)",
                                            background: "rgba(255,255,255,0.7)",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            textAlign: "center",
                                            color: "#1A1A2E",
                                            outline: "none"
                                        }}
                                    />
                                    <button
                                        onClick={handleAddToCart}
                                        style={{
                                            flex: 1,
                                            padding: "16px 30px",
                                            background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            boxShadow: "0 8px 24px rgba(255,165,0,0.4)",
                                            transition: "all 0.3s"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = "translateY(-2px)";
                                            e.target.style.boxShadow = "0 12px 30px rgba(255,165,0,0.5)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = "translateY(0)";
                                            e.target.style.boxShadow = "0 8px 24px rgba(255,165,0,0.4)";
                                        }}
                                    >
                                        🛒 Add to Cart
                                    </button>
                                </div>
                            </div>
                        )}

                        {msg && (
                            <div style={{
                                padding: "18px 24px",
                                background: msg.includes("✓")
                                    ? "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05))"
                                    : "linear-gradient(135deg, rgba(220,53,69,0.15), rgba(220,53,69,0.05))",
                                backdropFilter: "blur(10px)",
                                border: `2px solid ${msg.includes("✓") ? "#4CAF50" : "#dc3545"}`,
                                borderRadius: "12px",
                                color: msg.includes("✓") ? "#4CAF50" : "#dc3545",
                                fontWeight: "700",
                                marginBottom: "20px",
                                fontSize: "16px"
                            }}>
                                {msg}
                            </div>
                        )}

                        {/* Admin/Vendor Actions */}
                        {(role === "ADMIN" || role === "VENDOR") && (
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <Link to={`/products/${id}/edit`} style={{ textDecoration: "none" }}>
                                    <button style={{
                                        padding: "14px 28px",
                                        background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        boxShadow: "0 4px 15px rgba(30,144,255,0.3)",
                                        transition: "all 0.3s"
                                    }}>
                                        ✏️ Edit Product
                                    </button>
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    style={{
                                        padding: "14px 28px",
                                        background: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        transition: "all 0.3s"
                                    }}
                                >
                                    🗑️ Delete Product
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section - Glassmorphism */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{
                        fontSize: "32px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "30px"
                    }}>
                        ⭐ Customer Reviews
                    </h2>

                    {token && role === "CUSTOMER" && (
                        <div style={{ marginBottom: "30px" }}>
                            {!showReviewForm ? (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    style={{
                                        padding: "14px 28px",
                                        background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        boxShadow: "0 4px 15px rgba(255,165,0,0.3)",
                                        transition: "all 0.3s"
                                    }}
                                >
                                    ✍️ Write a Review
                                </button>
                            ) : (
                                <form onSubmit={handleSubmitReview} style={{
                                    background: "linear-gradient(135deg, rgba(30,144,255,0.05), rgba(75,54,139,0.05))",
                                    backdropFilter: "blur(10px)",
                                    padding: "30px",
                                    borderRadius: "16px",
                                    border: "2px solid rgba(30,144,255,0.2)"
                                }}>
                                    <div style={{ marginBottom: "20px" }}>
                                        <label style={{ fontWeight: "700", marginBottom: "8px", display: "block", color: "#1A1A2E" }}>
                                            Rating:
                                        </label>
                                        <select
                                            value={newReview.rating}
                                            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                            style={{
                                                padding: "14px 18px",
                                                borderRadius: "12px",
                                                border: "2px solid rgba(30,144,255,0.3)",
                                                background: "rgba(255,255,255,0.7)",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                outline: "none"
                                            }}
                                        >
                                            {[5, 4, 3, 2, 1].map(r => (
                                                <option key={r} value={r}>{renderStars(r)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: "20px" }}>
                                        <label style={{ fontWeight: "700", marginBottom: "8px", display: "block", color: "#1A1A2E" }}>
                                            Comment:
                                        </label>
                                        <textarea
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            rows="4"
                                            placeholder="Share your experience with this product..."
                                            style={{
                                                width: "100%",
                                                padding: "14px 18px",
                                                borderRadius: "12px",
                                                border: "2px solid rgba(30,144,255,0.3)",
                                                background: "rgba(255,255,255,0.7)",
                                                fontSize: "16px",
                                                resize: "vertical",
                                                fontFamily: "inherit",
                                                outline: "none"
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <button type="submit" style={{
                                            padding: "14px 28px",
                                            background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            boxShadow: "0 4px 15px rgba(76,175,80,0.3)"
                                        }}>
                                            Submit Review
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowReviewForm(false)}
                                            style={{
                                                padding: "14px 28px",
                                                background: "#6c757d",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "12px",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                fontSize: "16px"
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {reviewMsg && (
                                <div style={{
                                    marginTop: "16px",
                                    padding: "14px 18px",
                                    background: reviewMsg.includes("✓")
                                        ? "rgba(76,175,80,0.15)"
                                        : "rgba(220,53,69,0.15)",
                                    color: reviewMsg.includes("✓") ? "#4CAF50" : "#dc3545",
                                    borderRadius: "12px",
                                    fontWeight: "700",
                                    border: `2px solid ${reviewMsg.includes("✓") ? "#4CAF50" : "#dc3545"}`
                                }}>
                                    {reviewMsg}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px" }}>
                            <div style={{ fontSize: "80px", marginBottom: "20px", opacity: 0.3 }}>⭐</div>
                            <p style={{ fontSize: "18px", color: "#999", fontWeight: "600" }}>
                                No reviews yet. Be the first to review!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {reviews.map(review => (
                                <div key={review.id} style={{
                                    padding: "24px",
                                    background: "linear-gradient(135deg, rgba(30,144,255,0.03), rgba(75,54,139,0.03))",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(30,144,255,0.1)",
                                    transition: "all 0.3s"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "12px"
                                    }}>
                                        <span style={{ fontSize: "22px" }}>{renderStars(review.rating)}</span>
                                        <span style={{ color: "#999", fontSize: "14px", fontWeight: "600" }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ color: "#1A1A2E", lineHeight: "1.7", fontSize: "16px" }}>
                                        {review.comment || <em style={{ color: "#999" }}>No comment provided</em>}
                                    </p>
                                    {review.adminNote && (
                                        <div style={{
                                            marginTop: "16px",
                                            padding: "14px 18px",
                                            background: "rgba(30,144,255,0.1)",
                                            borderLeft: "4px solid #1E90FF",
                                            borderRadius: "8px"
                                        }}>
                                            <strong style={{ color: "#1E90FF", fontSize: "14px" }}>Admin Note:</strong>
                                            <span style={{ color: "#666", marginLeft: "8px" }}>{review.adminNote}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Animation */}
            <style>
                {`
                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
}
