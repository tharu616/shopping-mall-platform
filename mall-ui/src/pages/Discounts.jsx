import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => { fetchDiscounts(); }, []);

    function fetchDiscounts() {
        API.get("/discounts")
            .then(res => setDiscounts(res.data))
            .catch(() => setError("Failed to load discounts."))
            .finally(() => setLoading(false));
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this discount?")) return;
        try {
            await API.delete(`/discounts/${id}`);
            setDiscounts(discounts.filter(d => d.id !== id));
        } catch { alert("Failed to delete discount."); }
    };

    const toggleActive = async (discount) => {
        try {
            const updated = await API.put(`/discounts/${discount.id}`, { ...discount, active: !discount.active });
            setDiscounts(discounts.map(d => d.id === discount.id ? updated.data : d));
        } catch { alert("Failed to update discount status."); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading discounts...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4">
            <div className="glass-card max-w-sm w-full text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-rose-400 font-bold">{error}</p>
                <button onClick={fetchDiscounts} className="btn-primary mt-5 justify-center">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-rose-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-12 flex-wrap gap-5">
                    <div>
                        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Admin · Promotions</p>
                        <h1 className="text-4xl font-black text-white tracking-tight">Discount Codes</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {discounts.length} discount{discounts.length !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    <Link to="/discounts/create">
                        <button className="btn-primary">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Discount
                        </button>
                    </Link>
                </div>

                {discounts.length === 0 ? (
                    <div className="glass-card text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4">🏷️</div>
                        <p className="text-white font-bold mb-1">No discounts yet</p>
                        <p className="text-slate-500 text-sm mb-6">Create your first discount code to get started</p>
                        <Link to="/discounts/create">
                            <button className="btn-primary justify-center">Create Discount</button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {discounts.map(discount => (
                            <div
                                key={discount.id}
                                className="bg-white/[0.03] border border-white/10 hover:border-white/18 rounded-2xl p-5 transition-all"
                            >
                                <div className="flex flex-wrap items-center gap-5">

                                    {/* Code + Name */}
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xl flex-shrink-0 shadow-lg">
                                            🏷️
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-amber-400 font-black text-base tracking-wider">{discount.code}</p>
                                            <p className="text-slate-400 text-xs">{discount.name}</p>
                                        </div>
                                    </div>

                                    {/* Percentage */}
                                    <div className="flex-shrink-0">
                                        <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-black rounded-full">
                                            {discount.percentage}% off
                                        </span>
                                    </div>

                                    {/* Valid period */}
                                    <div className="text-xs text-slate-500 flex-shrink-0 min-w-[140px]">
                                        {discount.startsAt && discount.endsAt ? (
                                            <div className="flex flex-col gap-0.5">
                                                <span>📅 {new Date(discount.startsAt).toLocaleDateString()}</span>
                                                <span>→ {new Date(discount.endsAt).toLocaleDateString()}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-600">No expiry</span>
                                        )}
                                    </div>

                                    {/* Active toggle */}
                                    <button
                                        onClick={() => toggleActive(discount)}
                                        className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black transition-all ${
                                            discount.active
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                                : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400"
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${discount.active ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                                        {discount.active ? "Active" : "Inactive"}
                                    </button>

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Link to={`/discounts/edit/${discount.id}`}>
                                            <button className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all">
                                                ✏️ Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(discount.id)}
                                            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}