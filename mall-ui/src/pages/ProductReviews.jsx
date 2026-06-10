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
        if (!token) { setMsg("Please login to submit a review"); return; }
        setSubmitting(true); setMsg("");
        try {
            await API.post("/api/reviews", { productId, rating, comment: comment.trim() });
            setMsg("✓ Review submitted! It will appear after admin approval.");
            setRating(5); setComment("");
            if (onReviewAdded) onReviewAdded();
            setTimeout(() => setMsg(""), 5000);
        } catch (err) {
            setMsg("❌ Failed to submit");
        }
        setSubmitting(false);
    }

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mt-8">

            {/* Header */}
            <h2 className="text-white text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center text-lg">⭐</span>
                Customer Reviews
                {reviews?.length > 0 && (
                    <span className="ml-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-bold rounded-full">
                        {reviews.length}
                    </span>
                )}
            </h2>

            {/* Write Review Form */}
            {token && (
                <form onSubmit={handleSubmit} className="mb-10 p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <h3 className="text-white text-lg font-bold mb-6">Write a Review</h3>

                    {/* Star Rating */}
                    <div className="mb-6">
                        <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
                            Your Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRating(r)}
                                    className={`text-3xl transition-all duration-150 hover:scale-110 ${r <= rating ? "opacity-100" : "opacity-25 grayscale"}`}
                                >
                                    ⭐
                                </button>
                            ))}
                            <span className="ml-3 text-slate-400 text-sm self-center">{rating} / 5</span>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
                            Comment <span className="text-slate-500 normal-case tracking-normal font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder="Share your experience with this product..."
                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all resize-none font-inherit"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`btn-primary ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {submitting ? (
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

                    {msg && (
                        <div className={`flex items-center gap-3 mt-4 p-4 rounded-xl text-sm font-medium ${
                            msg.includes("✓")
                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                                : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                        }`}>
                            <span>{msg.includes("✓") ? "✅" : "⚠️"}</span> {msg}
                        </div>
                    )}
                </form>
            )}

            {/* Reviews List */}
            <div className="flex flex-col gap-4">
                {reviews && reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="group p-6 bg-white/[0.02] border border-white/8 hover:border-white/15 rounded-2xl transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                    {review.userName?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">{review.userName}</p>
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
                            <p className="text-slate-400 text-sm leading-relaxed pl-13">
                                {review.comment}
                            </p>
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
    );
}