import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../AuthContext";

export default function Payments() {
    const { role } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => { fetchPayments(); }, [role]);

    function fetchPayments() {
        setLoading(true);
        const endpoint = role === "ADMIN" ? "/payments/pending" : "/payments/mine";
        API.get(endpoint)
            .then(res => setPayments(res.data))
            .catch((err) => { console.error("Fetch error:", err); setError("Failed to load payments."); })
            .finally(() => setLoading(false));
    }

    const statusConfig = {
        VERIFIED: { color: "text-emerald-400", border: "border-emerald-400/40", bg: "bg-emerald-400/10", dot: "bg-emerald-400", icon: "✓"  },
        REJECTED: { color: "text-rose-400",    border: "border-rose-400/40",    bg: "bg-rose-400/10",    dot: "bg-rose-400",    icon: "✗"  },
        PENDING:  { color: "text-amber-400",   border: "border-amber-400/40",   bg: "bg-amber-400/10",   dot: "bg-amber-400",   icon: "⏳" },
    };
    const getStatusCfg = (s) => statusConfig[s] || { color: "text-slate-400", border: "border-slate-400/40", bg: "bg-slate-400/10", dot: "bg-slate-400", icon: "?" };

    /* ── Loading ── */
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading payments...</p>
            </div>
        </div>
    );

    /* ── Error ── */
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4 relative overflow-hidden">
            <div className="absolute inset-0 grid-overlay pointer-events-none" />
            <div className="relative z-10 glass-card max-w-sm w-full text-center py-12">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-white text-xl font-black mb-2">Something went wrong</h2>
                <p className="text-rose-400 text-sm mb-6">{error}</p>
                <button onClick={fetchPayments} className="btn-primary justify-center w-full">Retry</button>
            </div>
        </div>
    );

    const totalAmount = payments
        .filter(p => p.status === "VERIFIED")
        .reduce((sum, p) => sum + p.amount, 0);

    const statsData = [
        { icon: "💰", label: "Total",    value: payments.length,                                               grad: "from-blue-500 to-violet-600"   },
        { icon: "⏳", label: "Pending",  value: payments.filter(p => p.status === "PENDING").length,           grad: "from-amber-400 to-orange-500"  },
        { icon: "✓",  label: "Verified", value: payments.filter(p => p.status === "VERIFIED").length,          grad: "from-emerald-500 to-teal-600"  },
        ...(role === "CUSTOMER" ? [{ icon: "💵", label: "Verified Amount", value: `$${totalAmount.toFixed(2)}`, grad: "from-violet-500 to-purple-700" }] : []),
    ];

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
                    <div>
                        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
                            {role === "ADMIN" ? "Admin · Finance" : "Account · Payments"}
                        </p>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            {role === "ADMIN" ? "Pending Payments" : "My Payments"}
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">
                            {role === "ADMIN"
                                ? "Review and approve payment submissions"
                                : "Track your payment history and status"}
                        </p>
                    </div>

                    {role === "CUSTOMER" && (
                        <Link to="/payments/upload" className="no-underline">
                            <button className="btn-primary">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload New Payment
                            </button>
                        </Link>
                    )}
                </div>

                {/* Stats */}
                {payments.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                        {statsData.map(stat => (
                            <div key={stat.label} className="bg-white/[0.03] border border-white/10 hover:border-white/20 hover:-translate-y-1 rounded-2xl p-5 text-center transition-all duration-200">
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <p className={`text-2xl font-black bg-gradient-to-br ${stat.grad} bg-clip-text text-transparent`}>{stat.value}</p>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {payments.length === 0 ? (
                    <div className="glass-card text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4">💳</div>
                        <p className="text-white font-black text-xl mb-2">No Payments Found</p>
                        <p className="text-slate-500 text-sm">
                            {role === "ADMIN"
                                ? "There are no pending payments to review"
                                : "You haven't made any payments yet"}
                        </p>
                        {role === "CUSTOMER" && (
                            <Link to="/payments/upload" className="no-underline inline-block mt-6">
                                <button className="btn-primary">Upload a Payment</button>
                            </Link>
                        )}
                    </div>
                ) : (
                    /* ── Payments table ── */
                    <div className="glass-card overflow-x-auto">
                        <div className={`min-w-[640px]`}>

                            {/* Column headers */}
                            <div className={`grid gap-3 px-4 pb-4 border-b border-white/8 text-slate-600 text-xs font-bold uppercase tracking-widest ${
                                role === "CUSTOMER"
                                    ? "grid-cols-[80px_130px_130px_100px_130px_1fr_120px]"
                                    : "grid-cols-[80px_130px_130px_100px_130px_120px]"
                            }`}>
                                <span>ID</span>
                                <span>Order</span>
                                <span>Reference</span>
                                <span className="text-right">Amount</span>
                                <span>Status</span>
                                {role === "CUSTOMER" && <span>Admin Note</span>}
                                <span className="text-center">Action</span>
                            </div>

                            {/* Rows */}
                            <div className="flex flex-col gap-2 mt-3">
                                {payments.map(payment => {
                                    const sc = getStatusCfg(payment.status);
                                    return (
                                        <div
                                            key={payment.id}
                                            className={`grid gap-3 px-4 py-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/8 hover:border-white/15 rounded-xl transition-all items-center ${
                                                role === "CUSTOMER"
                                                    ? "grid-cols-[80px_130px_130px_100px_130px_1fr_120px]"
                                                    : "grid-cols-[80px_130px_130px_100px_130px_120px]"
                                            }`}
                                        >
                                            {/* ID */}
                                            <p className="text-slate-400 text-xs font-black">#{payment.id}</p>

                                            {/* Order */}
                                            <Link to={`/orders/${payment.orderId}`}
                                                className="text-blue-400 hover:text-blue-300 font-bold text-sm no-underline transition-colors truncate">
                                                Order #{payment.orderId}
                                            </Link>

                                            {/* Reference */}
                                            <p className="text-white font-bold text-sm truncate">{payment.reference}</p>

                                            {/* Amount */}
                                            <p className="text-right font-black text-sm gradient-text-price">${payment.amount}</p>

                                            {/* Status */}
                                            <div>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black ${sc.bg} ${sc.border} ${sc.color}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot} ${payment.status === "PENDING" ? "animate-pulse" : ""}`} />
                                                    {sc.icon} {payment.status}
                                                </span>
                                            </div>

                                            {/* Admin note (customer only) */}
                                            {role === "CUSTOMER" && (
                                                <p className={`text-xs truncate ${payment.adminNote ? "text-slate-400" : "text-slate-600 italic"}`}>
                                                    {payment.adminNote || "No note"}
                                                </p>
                                            )}

                                            {/* Action */}
                                            <div className="flex justify-center">
                                                {role === "ADMIN" && payment.status === "PENDING" ? (
                                                    <Link to={`/payments/${payment.id}`} className="no-underline">
                                                        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 text-xs font-black transition-all">
                                                            Review →
                                                        </button>
                                                    </Link>
                                                ) : (
                                                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
                                                        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/12 text-slate-400 hover:border-white/20 hover:text-white text-xs font-bold transition-all">
                                                            📄 Receipt
                                                        </button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}