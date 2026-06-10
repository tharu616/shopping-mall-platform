import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminReviews() {
    const { role } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (role !== "ADMIN") { navigate("/"); return; }
        fetchReviews();
    }, [role, navigate]);

    async function fetchReviews() {
        setLoading(true);
        try {
            const res = await API.get("/api/reviews/admin/all");
            setReviews(res.data);
        } catch (err) { setMsg("Failed to load reviews"); }
        setLoading(false);
    }

    async function handleAction(reviewId, action) {
        try {
            await API.put(`/api/reviews/admin/${reviewId}/action`, { action });
            setMsg(`✓ Review ${action === "APPROVE" ? "approved" : "rejected"} successfully`);
            fetchReviews();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) { setMsg("❌ Action failed"); }
    }

    async function handleDelete(reviewId) {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await API.delete(`/api/reviews/admin/${reviewId}`);
            setMsg("✓ Review deleted successfully");
            fetchReviews();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) { setMsg("❌ Failed to delete review"); }
    }

    const filterTabs = [
        { key: "all",      label: "All",      dot: "bg-slate-400"   },
        { key: "pending",  label: "Pending",  dot: "bg-amber-400"   },
        { key: "approved", label: "Approved", dot: "bg-emerald-400" },
        { key: "rejected", label: "Rejected", dot: "bg-rose-400"    },
    ];

    const statusConfig = {
        PENDING:  { label: "Pending",  classes: "bg-amber-400/10 border-amber-400/30 text-amber-400"   },
        APPROVED: { label: "Approved", classes: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
        REJECTED: { label: "Rejected", classes: "bg-rose-500/10 border-rose-500/30 text-rose-400"     },
    };

    const filteredReviews = reviews.filter(r =>
        filter === "all" || r.status === filter.toUpperCase()
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading reviews...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Admin · Moderation</p>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Review Management</h1>
                    <p className="text-slate-400 text-sm">Approve, reject, or delete customer reviews</p>
                </div>

                {/* Global message */}
                {msg && (
                    <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl text-sm font-medium ${
                        msg.includes("✓")
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    }`}>
                        <span>{msg.includes("✓") ? "✅" : "⚠️"}</span> {msg}
                    </div>
                )}

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                                filter === tab.key
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "bg-white/[0.02] border-white/8 text-slate-400 hover:border-white/15 hover:text-white"
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                                filter === tab.key ? "bg-white/15 text-white" : "bg-white/5 text-slate-500"
                            }`}>
                                {reviews.filter(r => tab.key === "all" || r.status === tab.key.toUpperCase()).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Reviews list */}
                {filteredReviews.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">⭐</div>
                        <p className="text-white font-bold mb-1">No reviews found</p>
                        <p className="text-slate-500 text-sm">Try a different filter</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {filteredReviews.map(review => {
                            const sc = statusConfig[review.status] || statusConfig.PENDING;
                            return (
                                <div key={review.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/18 transition-all">

                                    {/* Top row */}
                                    <div className="flex items-start justify-between gap-4 mb-5">
                                        <div className="flex items-start gap-4 min-w-0">
                                            {/* Avatar */}
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                                {review.userName?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-white font-black text-base truncate">{review.productName}</h3>
                                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                    <p className="text-slate-400 text-xs">
                                                        <span className="text-slate-500">By</span> <span className="text-white font-semibold">{review.userName}</span>
                                                    </p>
                                                    <span className="text-slate-700 text-xs">·</span>
                                                    <p className="text-slate-500 text-xs">{review.createdAt}</p>
                                                </div>
                                                {/* Stars */}
                                                <div className="flex gap-0.5 mt-2">
                                                    {[1,2,3,4,5].map(s => (
                                                        <span key={s} className={`text-sm ${s <= review.rating ? "opacity-100" : "opacity-20 grayscale"}`}>⭐</span>
                                                    ))}
                                                    <span className="text-amber-400 text-xs font-bold ml-2">{review.rating}/5</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Status badge */}
                                        <span className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-black ${sc.classes}`}>
                                            {sc.label}
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    {review.comment && (
                                        <div className="px-4 py-3 bg-white/[0.03] border border-white/8 rounded-xl mb-5">
                                            <p className="text-slate-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        {review.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(review.id, "APPROVE")}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-sm font-bold transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(review.id, "REJECT")}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-sm font-bold transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-sm font-bold transition-all ml-auto"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}