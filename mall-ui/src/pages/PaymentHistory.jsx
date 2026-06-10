import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: "", startDate: "", endDate: "", userEmail: "" });
    const [summary, setSummary] = useState({
        total: 0, verified: 0, pending: 0, rejected: 0, totalAmount: 0, verifiedAmount: 0
    });

    useEffect(() => { fetchPaymentHistory(); }, []);

    function fetchPaymentHistory() {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.status)    params.append("status", filters.status);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate)   params.append("endDate", filters.endDate);
        if (filters.userEmail) params.append("userEmail", filters.userEmail);
        API.get(`/payments/history?${params.toString()}`)
            .then(res => { setPayments(res.data); calculateSummary(res.data); })
            .catch(err => console.error("Failed to fetch payment history", err))
            .finally(() => setLoading(false));
    }

    function calculateSummary(data) {
        setSummary({
            total: data.length,
            verified: data.filter(p => p.status === "VERIFIED").length,
            pending:  data.filter(p => p.status === "PENDING").length,
            rejected: data.filter(p => p.status === "REJECTED").length,
            totalAmount:    data.reduce((sum, p) => sum + p.amount, 0),
            verifiedAmount: data.filter(p => p.status === "VERIFIED").reduce((sum, p) => sum + p.amount, 0),
        });
    }

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
    const handleApplyFilters = () => fetchPaymentHistory();
    const handleClearFilters = () => {
        setFilters({ status: "", startDate: "", endDate: "", userEmail: "" });
        setTimeout(() => fetchPaymentHistory(), 100);
    };

    const downloadCSV = () => {
        const headers = ["Payment ID", "Order ID", "User Email", "Amount", "Status", "Reference"];
        const csvData = [
            headers.join(","),
            ...payments.map(p => `${p.id},${p.orderId},${p.userEmail},$${p.amount},${p.status},${p.reference || "N/A"}`)
        ].join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payment-history-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

    const downloadPDF = () => {
        alert("PDF generation feature coming soon! For now, use CSV export.");
    };

    const statusConfig = {
        VERIFIED: { classes: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
        PENDING:  { classes: "bg-amber-400/10  border-amber-400/25  text-amber-400"    },
        REJECTED: { classes: "bg-rose-500/10   border-rose-500/25   text-rose-400"     },
    };
    const getStatusCls = (s) => (statusConfig[s] || { classes: "bg-white/5 border-white/10 text-slate-400" }).classes;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading payment history...</p>
            </div>
        </div>
    );

    const inputClass = "px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all [color-scheme:dark]";

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Admin · Finance</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">Payment History</h1>
                    <p className="text-slate-400 text-sm mt-2">View, filter, and export payment transaction history</p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {[
                        { label: "Total",           value: summary.total,                           grad: "from-blue-500 to-violet-600"   },
                        { label: "Verified",        value: summary.verified,                        grad: "from-emerald-500 to-teal-600"  },
                        { label: "Pending",         value: summary.pending,                         grad: "from-amber-400 to-orange-500"  },
                        { label: "Rejected",        value: summary.rejected,                        grad: "from-rose-500 to-pink-600"     },
                        { label: "Total Amount",    value: `$${summary.totalAmount.toFixed(2)}`,    grad: "from-violet-500 to-purple-700" },
                        { label: "Verified Amount", value: `$${summary.verifiedAmount.toFixed(2)}`, grad: "from-emerald-500 to-teal-600"  },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
                            <p className={`text-xl font-black bg-gradient-to-br ${stat.grad} bg-clip-text text-transparent`}>{stat.value}</p>
                            <p className="text-slate-500 text-xs font-semibold mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="glass-card mb-8">
                    <h3 className="text-white text-sm font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                        <span>🔍</span> Filters
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                        <input type="text" name="userEmail" placeholder="Search by email"
                            value={filters.userEmail} onChange={handleFilterChange} className={inputClass} />
                        <select name="status" value={filters.status} onChange={handleFilterChange}
                            className={inputClass}>
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <input type="date" name="startDate" value={filters.startDate}
                            onChange={handleFilterChange} className={inputClass} />
                        <input type="date" name="endDate" value={filters.endDate}
                            onChange={handleFilterChange} className={inputClass} />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleApplyFilters} className="btn-primary py-2.5 px-6 text-sm">
                            Apply Filters
                        </button>
                        <button onClick={handleClearFilters} className="btn-ghost py-2.5 px-6 text-sm">
                            Clear
                        </button>
                    </div>
                </div>

                {/* Export */}
                <div className="flex gap-3 mb-6">
                    <button onClick={downloadCSV}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 text-sm font-bold transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </button>
                    <button onClick={downloadPDF}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 text-sm font-bold transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                    </button>
                </div>

                {/* Table */}
                <div className="glass-card overflow-x-auto">
                    <div className="min-w-[700px]">

                        {/* Table header */}
                        <div className="grid grid-cols-[80px_90px_1fr_110px_120px_130px_90px] gap-3 px-4 pb-4 border-b border-white/8">
                            {["ID", "Order", "User Email", "Amount", "Status", "Reference", ""].map((h, i) => (
                                <p key={i} className={`text-slate-600 text-xs font-bold uppercase tracking-widest ${i === 3 ? "text-right" : ""}`}>{h}</p>
                            ))}
                        </div>

                        {payments.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3">💳</div>
                                <p className="text-slate-500 text-sm">No payment records found</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 mt-3">
                                {payments.map(payment => (
                                    <div key={payment.id}
                                        className="grid grid-cols-[80px_90px_1fr_110px_120px_130px_90px] gap-3 px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/8 hover:border-white/15 rounded-xl transition-all items-center"
                                    >
                                        <p className="text-slate-400 text-xs font-bold">#{payment.id}</p>
                                        <Link to={`/orders/${payment.orderId}`}
                                            className="text-blue-400 hover:text-blue-300 font-bold text-sm no-underline transition-colors">
                                            #{payment.orderId}
                                        </Link>
                                        <p className="text-slate-300 text-xs truncate">{payment.userEmail}</p>
                                        <p className="text-white font-black text-sm text-right">${payment.amount.toFixed(2)}</p>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full border text-xs font-black ${getStatusCls(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs truncate">{payment.reference || "N/A"}</p>
                                        <div>
                                            <Link to={`/payments/${payment.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-bold no-underline transition-all">
                                                View →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}