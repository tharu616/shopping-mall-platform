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
                productId, rating, comment: text
            });
            setText(""); setRating(5);
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
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-10 mt-4">

            {/* Header */}
            <h3 className="text-white text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center text-lg">⭐</span>
                Reviews & Ratings
                {reviews.length > 0 && (
                    <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-bold rounded-full">
                        {reviews.length}
                    </span>
                )}
            </h3>

            {/* Empty state */}
            {reviews.length === 0 && (
                <div className="flex flex-col items-center py-10 text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-3">💬</div>
                    <p className="text-white font-bold mb-1">No reviews yet</p>
                    <p className="text-slate-500 text-sm">Be the first to share your experience!</p>
                </div>
            )}

            {/* Reviews list */}
            {reviews.length > 0 && (
                <div className="flex flex-col gap-4 mb-8">
                    {reviews.map(r => (
                        <div key={r.id} className="group flex items-start justify-between gap-4 p-5 bg-white/[0.02] border border-white/8 hover:border-white/15 rounded-2xl transition-all duration-200">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                    {r.userName?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                        <span className="text-white font-bold text-sm">{r.userName || "Anonymous"}</span>
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(s => (
                                                <span key={s} className={`text-sm ${s <= r.rating ? "opacity-100" : "opacity-20 grayscale"}`}>⭐</span>
                                            ))}
                                        </div>
                                        <span className="text-amber-400 text-xs font-bold">{r.rating}/5</span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">{r.comment}</p>
                                </div>
                            </div>
                            {(role === "ADMIN" || r.userId === user?.id) && (
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add review form */}
            {(role === "CUSTOMER" || role === "ADMIN") && (
                <form onSubmit={handleAdd} className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl mt-2">
                    <h4 className="text-white text-sm font-black uppercase tracking-widest mb-5">Add Your Review</h4>

                    {/* Star picker */}
                    <div className="mb-5">
                        <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">Rating</label>
                        <div className="flex items-center gap-2">
                            {[1,2,3,4,5].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRating(r)}
                                    className={`text-2xl transition-all duration-150 hover:scale-110 ${r <= rating ? "opacity-100" : "opacity-25 grayscale"}`}
                                >
                                    ⭐
                                </button>
                            ))}
                            <span className="ml-2 text-slate-400 text-sm">{rating} / 5</span>
                        </div>
                    </div>

                    {/* Comment + submit row */}
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Comment</label>
                            <input
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="Write your review here..."
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                            />
                        </div>
                        <button type="submit" className="btn-primary py-3 px-6 whitespace-nowrap">
                            Add Review
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </form>
            )}

            {/* Message */}
            {msg && (
                <div className={`flex items-center gap-3 mt-4 p-4 rounded-xl text-sm font-medium ${
                    msg === "Review added!"
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                        : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                }`}>
                    <span>{msg === "Review added!" ? "✅" : "⚠️"}</span> {msg}
                </div>
            )}
        </div>
    );
}