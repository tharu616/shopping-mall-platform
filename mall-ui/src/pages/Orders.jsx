import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersErrors, setOrdersErrors] = useState({});

    useEffect(() => {
        API.get("/orders")
            .then(res => { setOrders(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    function validateOrder(order) {
        if (!order || !order.id) return "Invalid order data.";
        if (!order.status) return "Order status is missing.";
        if (order.total == null || order.total < 0) return "Invalid order total.";
        if (!order.items || order.items.length === 0) return "Order has no items.";
        return "";
    }

    function validateOrders(ordersList) {
        const errors = {};
        for (const ord of ordersList || []) {
            const err = validateOrder(ord);
            if (err) errors[ord.id] = err;
        }
        return errors;
    }

    useEffect(() => { setOrdersErrors(validateOrders(orders)); }, [orders]);

    const statusConfig = {
        PENDING:    { color: "text-amber-400",   border: "border-amber-400/40",   bg: "bg-amber-400/10",   dot: "bg-amber-400",   icon: "⏳", label: "Pending"    },
        CONFIRMED:  { color: "text-blue-400",    border: "border-blue-400/40",    bg: "bg-blue-400/10",    dot: "bg-blue-400",    icon: "✓",  label: "Confirmed"  },
        SHIPPED:    { color: "text-cyan-400",    border: "border-cyan-400/40",    bg: "bg-cyan-400/10",    dot: "bg-cyan-400",    icon: "🚚", label: "Shipped"    },
        DELIVERED:  { color: "text-emerald-400", border: "border-emerald-400/40", bg: "bg-emerald-400/10", dot: "bg-emerald-400", icon: "✅", label: "Delivered"  },
        CANCELLED:  { color: "text-rose-400",    border: "border-rose-400/40",    bg: "bg-rose-400/10",    dot: "bg-rose-400",    icon: "❌", label: "Cancelled"  },
    };
    const getStatusCfg = (s) => statusConfig[s] || statusConfig.PENDING;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading orders...</p>
            </div>
        </div>
    );

    if (orders.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />
            <div className="relative z-10 glass-card max-w-md w-full text-center py-14 px-10">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl mx-auto mb-6">📦</div>
                <h2 className="text-white text-3xl font-black mb-3">No Orders Yet</h2>
                <p className="text-slate-400 text-sm mb-8">You haven't placed any orders yet</p>
                <Link to="/products">
                    <button className="btn-primary w-full justify-center py-4 text-base">
                        Start Shopping
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </Link>
            </div>
        </div>
    );

    const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pendingCount = orders.filter(o => o.status === "PENDING").length;
    const deliveredCount = orders.filter(o => o.status === "DELIVERED").length;

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Account</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">Your Orders</h1>
                    <p className="text-slate-400 text-sm mt-2">Track and manage your orders</p>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Orders",   value: orders.length,               grad: "from-blue-500 to-violet-600"   },
                        { label: "Pending",        value: pendingCount,                grad: "from-amber-400 to-orange-500"  },
                        { label: "Delivered",      value: deliveredCount,              grad: "from-emerald-500 to-teal-600"  },
                        { label: "Total Spent",    value: `$${totalSpent.toFixed(2)}`, grad: "from-rose-500 to-pink-600"    },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
                            <p className={`text-2xl font-black bg-gradient-to-br ${stat.grad} bg-clip-text text-transparent`}>{stat.value}</p>
                            <p className="text-slate-500 text-xs font-semibold mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Orders list */}
                <div className="flex flex-col gap-4">
                    {orders.map(order => {
                        const sc = getStatusCfg(order.status);
                        const orderErr = ordersErrors[order.id];

                        return (
                            <div
                                key={order.id}
                                className={`group bg-white/[0.03] border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-200 ${
                                    orderErr ? "border-rose-500/40 bg-rose-500/[0.03]" : "border-white/10 hover:border-white/20"
                                }`}
                            >
                                <div className="flex flex-wrap items-center gap-5">

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                                        📦
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-black text-lg mb-1.5">Order #{order.id}</p>
                                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                            <span><strong className="text-slate-400">{order.items?.length || 0}</strong> item{order.items?.length !== 1 ? "s" : ""}</span>
                                            {order.createdAt && <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>}
                                            {order.total != null && (
                                                <span className="font-black gradient-text-price text-sm">${order.total.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border flex-shrink-0 ${sc.bg} ${sc.border}`}>
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot} ${order.status === "PENDING" ? "animate-pulse" : ""}`} />
                                        <span className={`text-xs font-black ${sc.color}`}>{sc.icon} {sc.label}</span>
                                    </div>

                                    {/* View */}
                                    <Link to={`/orders/${order.id}`} className="no-underline flex-shrink-0">
                                        <button
                                            disabled={!!orderErr}
                                            title={orderErr || "View order details"}
                                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                                orderErr
                                                    ? "bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed"
                                                    : "bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20"
                                            }`}
                                        >
                                            Details →
                                        </button>
                                    </Link>
                                </div>

                                {/* Inline error */}
                                {orderErr && (
                                    <p className="text-rose-400 text-xs font-semibold mt-3 flex items-center gap-1">
                                        <span>⚠️</span> {orderErr}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}