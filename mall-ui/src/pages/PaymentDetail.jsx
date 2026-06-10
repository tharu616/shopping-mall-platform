import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function PaymentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [actionMsg, setActionMsg] = useState("");

    useEffect(() => { fetchPayment(); }, [id]);

    function fetchPayment() {
        API.get(`/payments/${id}`)
            .then(res => setPayment(res.data))
            .catch(() => setError("Payment not found."))
            .finally(() => setLoading(false));
    }

    const handleApprove = async () => {
        setActionMsg("");
        try {
            await API.patch(`/payments/${id}/approve`, { adminNote });
            setActionMsg("Payment approved successfully!");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) { setActionMsg(err.response?.data?.message || "Failed to approve payment."); }
    };

    const handleReject = async () => {
        if (!adminNote.trim()) { setActionMsg("Please provide a reason for rejection."); return; }
        setActionMsg("");
        try {
            await API.patch(`/payments/${id}/reject`, { adminNote });
            setActionMsg("Payment rejected.");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) { setActionMsg(err.response?.data?.message || "Failed to reject payment."); }
    };

    const statusConfig = {
        VERIFIED: { color: "text-emerald-400", border: "border-emerald-400/40", bg: "bg-emerald-400/10", dot: "bg-emerald-400", icon: "✓"  },
        REJECTED: { color: "text-rose-400",    border: "border-rose-400/40",    bg: "bg-rose-400/10",    dot: "bg-rose-400",    icon: "✗"  },
        PENDING:  { color: "text-amber-400",   border: "border-amber-400/40",   bg: "bg-amber-400/10",   dot: "bg-amber-400",   icon: "⏳" },
    };
    const getStatusCfg = (s) => statusConfig[s] || { color: "text-slate-400", border: "border-slate-400/40", bg: "bg-slate-400/10", dot: "bg-slate-400", icon: "?" };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading payment details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4 relative overflow-hidden">
            <div className="absolute inset-0 grid-overlay pointer-events-none" />
            <div className="relative z-10 glass-card max-w-sm w-full text-center py-12">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-white text-xl font-black mb-2">Error</h2>
                <p className="text-rose-400 text-sm mb-6">{error}</p>
                <Link to="/payments">
                    <button className="btn-primary justify-center w-full">← Back to Payments</button>
                </Link>
            </div>
        </div>
    );

    if (!payment) return null;

    const sc = getStatusCfg(payment.status);
    const isSuccess = (msg) => msg.includes("success") || msg.includes("approved");

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">

                {/* Back */}
                <Link to="/payments" className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all no-underline">
                    ← Back to Payments
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
                    <div>
                        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">Payment Review</p>
                        <h1 className="text-4xl font-black text-white tracking-tight">Payment #{payment.id}</h1>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${sc.bg} ${sc.border}`}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot} ${payment.status === "PENDING" ? "animate-pulse" : ""}`} />
                        <span className={`font-black text-sm ${sc.color}`}>{sc.icon} {payment.status}</span>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="glass-card mb-6">
                    <h3 className="text-white font-black mb-7 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-base">💳</span>
                        Payment Information
                    </h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoItem label="Order ID" value={
                            <Link to={`/orders/${payment.orderId}`} className="text-blue-400 font-black hover:text-blue-300 transition-colors no-underline">
                                #{payment.orderId}
                            </Link>
                        } />
                        <InfoItem label="User Email"      value={payment.userEmail} />
                        <InfoItem label="Amount"          value={`$${payment.amount}`} gradient />
                        <InfoItem label="Reference"       value={payment.reference || "N/A"} />
                        <InfoItem label="Payment Method"  value={payment.paymentMethod || "N/A"} />
                    </div>

                    {payment.adminNote && (
                        <div className="mt-6 p-4 bg-blue-500/[0.04] border-l-4 border-blue-400 rounded-r-xl">
                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Admin Note</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{payment.adminNote}</p>
                        </div>
                    )}
                </div>

                {/* Receipt */}
                {payment.receiptUrl && (
                    <div className="glass-card mb-6">
                        <h3 className="text-white font-black mb-6 flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center text-base">📄</span>
                            Payment Receipt
                        </h3>

                        <div className="p-6 rounded-2xl border-2 border-dashed border-blue-500/20 bg-blue-500/[0.03] text-center">
                            {payment.receiptUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img
                                    src={payment.receiptUrl}
                                    alt="Payment Receipt"
                                    className="max-w-full max-h-[500px] rounded-xl shadow-2xl mx-auto"
                                />
                            ) : (
                                <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
                                    <button className="btn-primary justify-center mx-auto">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        View Receipt (PDF/Document)
                                    </button>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Admin Review */}
                {payment.status === "PENDING" && (
                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.03]">
                        <h3 className="text-white font-black mb-1 flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center text-base">🔍</span>
                            Admin Review
                        </h3>
                        <p className="text-slate-500 text-xs ml-12 mb-6">
                            Review the payment details and receipt above, then approve or reject this submission.
                        </p>

                        <div className="mb-5">
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                Admin Note
                                <span className="text-slate-500 normal-case tracking-normal font-normal ml-2">(Optional for Approve · Required for Reject)</span>
                            </label>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                rows={4}
                                placeholder="Add a note for the customer..."
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm resize-none font-inherit outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleApprove}
                                className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 font-black text-sm transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve Payment
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-black text-sm transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject Payment
                            </button>
                        </div>

                        {actionMsg && (
                            <div className={`flex items-center gap-2 mt-5 p-4 rounded-xl border text-sm font-semibold ${
                                isSuccess(actionMsg)
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            }`}>
                                {isSuccess(actionMsg) ? "✅" : "⚠️"} {actionMsg}
                            </div>
                        )}
                    </div>
                )}

                {/* Already processed */}
                {payment.status !== "PENDING" && (
                    <div className="flex items-center gap-4 p-5 bg-amber-400/[0.05] border border-amber-400/20 rounded-2xl">
                        <span className="text-2xl flex-shrink-0">ℹ️</span>
                        <p className="text-amber-300 text-sm font-semibold">
                            This payment has already been <span className={`font-black ${sc.color}`}>{payment.status.toLowerCase()}</span>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

const InfoItem = ({ label, value, gradient = false }) => (
    <div className="p-4 bg-white/[0.02] border border-white/8 rounded-xl">
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
        <div className={`font-black text-base ${gradient ? "gradient-text-price text-xl" : "text-white"}`}>
            {value}
        </div>
    </div>
);