import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../AuthContext";

export default function ProductDetail() {
    const { id } = useParams();
    const { role, token } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [msg, setMsg] = useState("");
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMsg, setReviewMsg] = useState("");
    const [reviewErrors, setReviewErrors] = useState({ rating: "", comment: "" });

    useEffect(() => { loadProduct(); loadReviews(); }, [id]);

    async function loadProduct() {
        try {
            const res = await API.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    async function loadReviews() {
        try {
            const res = await API.get(`/api/reviews/product/${id}`);
            setReviews(res.data);
        } catch (err) { console.error("Failed to load reviews", err); }
    }

    async function addToCart() {
        try {
            await API.post("/cart/items", { productId: parseInt(id), quantity });
            setMsg("✓ Added to cart successfully!");
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to add to cart";
            setMsg(`❌ ${errorMsg}`);
            setTimeout(() => setMsg(""), 5000);
        }
    }

    function validateReviewForm(rating, comment) {
        const errors = { rating: "", comment: "" };
        const r = Number(rating);
        if (!Number.isInteger(r) || r < 1 || r > 5) errors.rating = "Please select a rating from 1 to 5.";
        const text = (comment ?? "").trim();
        if (!text) errors.comment = "Comment is required.";
        else if (text.length < 10) errors.comment = "Comment must be at least 10 characters.";
        else if (text.length > 1000) errors.comment = "Comment must be at most 1000 characters.";
        return errors;
    }

    async function handleReviewSubmit(e) {
        e.preventDefault();
        const errors = validateReviewForm(rating, comment);
        setReviewErrors(errors);
        if (Object.values(errors).some(Boolean)) return;
        if (!token) { setReviewMsg("❌ Please login to submit a review"); return; }
        setSubmittingReview(true); setReviewMsg("");
        try {
            await API.post("/api/reviews", { productId: parseInt(id), rating, comment: comment.trim() });
            setReviewMsg("✓ Review submitted! It will appear after admin approval.");
            setRating(5); setComment(""); setReviewErrors({ rating: "", comment: "" });
            setTimeout(() => { setReviewMsg(""); loadReviews(); }, 3000);
        } catch (err) {
            setReviewMsg("❌ Failed to submit review. " + (err.response?.data?.message || ""));
        } finally { setSubmittingReview(false); }
    }

    /* ── Loading ── */
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading product...</p>
            </div>
        </div>
    );

    /* ── Not found ── */
    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4">
            <div className="glass-card max-w-sm w-full text-center">
                <div className="text-6xl mb-5">❌</div>
                <h2 className="text-white text-2xl font-black mb-2">Product Not Found</h2>
                <p className="text-slate-400 text-sm mb-6">This product may have been removed.</p>
                <button onClick={() => navigate("/products")} className="btn-primary w-full justify-center py-3">
                    ← Back to Products
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            {/* Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/8 text-sm font-semibold transition-all"
                >
                    ← Back to Products
                </button>

                {/* ── Product Card ── */}
                <div className="glass-card mb-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Image */}
                        <div className="rounded-2xl overflow-hidden">
                            {product.imageUrl ? (
                                <img
                                    src={`http://localhost:8081${product.imageUrl}`}
                                    alt={product.name}
                                    className="w-full h-[480px] object-cover rounded-2xl"
                                />
                            ) : (
                                <div className="w-full h-[480px] bg-gradient-to-br from-[#1a1040] to-[#0d0d2b] rounded-2xl flex items-center justify-center text-[120px]">
                                    📦
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-6">

                            {/* Title + price */}
                            <div>
                                <h1 className="text-4xl font-black text-white leading-tight mb-4">{product.name}</h1>
                                <div className="text-5xl font-black gradient-text-price">${product.price?.toFixed(2)}</div>
                            </div>

                            {/* Stock badge */}
                            <div>
                                {product.stock > 0 ? (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        In Stock — {product.stock} available
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">📝 Description</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
                            </div>

                            {/* SKU */}
                            {product.sku && (
                                <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/8 inline-flex items-center gap-2">
                                    <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">SKU</span>
                                    <span className="text-white text-sm font-mono font-semibold">{product.sku}</span>
                                </div>
                            )}

                            {/* Quantity picker */}
                            {product.stock > 0 && (
                                <div>
                                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">Quantity</p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-black hover:bg-white/10 hover:border-amber-400/40 transition-all"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            className="w-20 h-11 text-center text-white font-black text-lg bg-white/5 border border-white/10 rounded-xl outline-none focus:border-amber-400/50 transition-all"
                                        />
                                        <button
                                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-black hover:bg-white/10 hover:border-amber-400/40 transition-all"
                                        >
                                            +
                                        </button>
                                        <span className="text-slate-500 text-xs">max {product.stock}</span>
                                    </div>
                                </div>
                            )}

                            {/* Cart / OOS button */}
                            {product.stock > 0 ? (
                                <button
                                    onClick={addToCart}
                                    className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg shadow-xl shadow-emerald-500/25 hover:-translate-y-1 hover:shadow-emerald-500/40 transition-all duration-300"
                                >
                                    🛒 Add to Cart
                                </button>
                            ) : (
                                <button disabled className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-black text-lg cursor-not-allowed">
                                    ✗ Out of Stock
                                </button>
                            )}

                            {/* Edit button (vendor/admin) */}
                            {(role === "VENDOR" || role === "ADMIN") && (
                                <button
                                    onClick={() => navigate(`/products/${id}/edit`)}
                                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
                                >
                                    ✏️ Edit Product
                                </button>
                            )}

                            {/* Cart message */}
                            {msg && (
                                <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                                    msg.includes("✓")
                                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                                        : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                                }`}>
                                    <span>{msg.includes("✓") ? "✅" : "⚠️"}</span> {msg}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Reviews Section ── */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">

                    <h2 className="text-white text-2xl font-black mb-8 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center text-lg">⭐</span>
                        Reviews & Ratings
                        {reviews.length > 0 && (
                            <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-bold rounded-full">
                                {reviews.length}
                            </span>
                        )}
                    </h2>

                    {/* Write review form */}
                    {token && (
                        <form onSubmit={handleReviewSubmit} className="mb-10 p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                            <h3 className="text-white text-lg font-bold mb-6">Write a Review</h3>

                            {/* Star rating */}
                            <div className="mb-6">
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
                                    Your Rating
                                </label>
                                <div className="flex items-center gap-2 mb-3">
                                    {[1,2,3,4,5].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRating(r)}
                                            className={`text-3xl transition-all duration-150 hover:scale-110 ${r <= rating ? "opacity-100" : "opacity-25 grayscale"}`}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                    <span className="ml-2 text-slate-400 text-sm">{rating} / 5</span>
                                </div>
                                {/* Range slider */}
                                <input
                                    type="range"
                                    min="1" max="5"
                                    value={rating}
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    className="w-full accent-amber-400 cursor-pointer"
                                />
                                {reviewErrors.rating && (
                                    <p className="text-rose-400 text-xs mt-2 font-semibold">{reviewErrors.rating}</p>
                                )}
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
                                    Comment <span className="text-slate-500 normal-case tracking-normal font-normal">(10–1000 characters)</span>
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="Share your experience with this product..."
                                    className={`w-full px-4 py-3 rounded-xl border text-white placeholder-slate-500 text-sm outline-none transition-all resize-none font-inherit ${
                                        reviewErrors.comment
                                            ? "border-rose-500/60 bg-rose-500/5 focus:border-rose-400"
                                            : "border-white/10 bg-white/5 focus:border-amber-400/50 focus:bg-white/8"
                                    }`}
                                />
                                <div className="flex justify-between mt-2">
                                    <div className="flex gap-3">
                                        {reviewErrors.comment && (
                                            <p className="text-rose-400 text-xs font-semibold">{reviewErrors.comment}</p>
                                        )}
                                        {!reviewErrors.comment && comment.trim().length > 0 && comment.trim().length < 10 && (
                                            <p className="text-amber-400 text-xs">{10 - comment.trim().length} more characters needed</p>
                                        )}
                                    </div>
                                    <span className={`text-xs ${comment.length > 1000 ? "text-rose-400" : comment.length > 900 ? "text-amber-400" : "text-slate-600"}`}>
                                        {comment.length} / 1000
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className={`btn-primary ${submittingReview ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {submittingReview ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Review
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {reviewMsg && (
                                <div className={`flex items-center gap-3 mt-4 p-4 rounded-xl text-sm font-medium ${
                                    reviewMsg.includes("✓")
                                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                                        : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                                }`}>
                                    <span>{reviewMsg.includes("✓") ? "✅" : "⚠️"}</span> {reviewMsg}
                                </div>
                            )}
                        </form>
                    )}

                    {/* Not logged in nudge */}
                    {!token && (
                        <div className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
                            <p className="text-slate-400 text-sm">
                                <a href="/login" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">Login</a>
                                {" "}to write a review
                            </p>
                        </div>
                    )}

                    {/* Reviews list */}
                    <div className="flex flex-col gap-4">
                        {reviews.length > 0 ? reviews.map(review => (
                            <div key={review.id} className="group p-6 bg-white/[0.02] border border-white/8 hover:border-white/15 rounded-2xl transition-all duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                            {review.userName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">{review.userName || "Anonymous"}</p>
                                            <div className="flex gap-0.5 mt-1">
                                                {[1,2,3,4,5].map(s => (
                                                    <span key={s} className={`text-sm ${s <= review.rating ? "opacity-100" : "opacity-20 grayscale"}`}>⭐</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-slate-600 text-xs">{review.createdAt}</span>
                                </div>
                                {review.comment && (
                                    <p className="text-slate-400 text-sm leading-relaxed pl-13">{review.comment}</p>
                                )}
                            </div>
                        )) : (
                            <div className="flex flex-col items-center py-16 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">💬</div>
                                <p className="text-white font-bold mb-1">No reviews yet</p>
                                <p className="text-slate-500 text-sm">Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}