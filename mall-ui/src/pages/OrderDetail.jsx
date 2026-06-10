import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../AuthContext";

export default function OrderDetail() {
    const { id } = useParams();
    const { role } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [updateMsg, setUpdateMsg] = useState("");
    const [statusError, setStatusError] = useState("");

    const getValidNextStatuses = (currentStatus) => {
        const transitions = {
            PENDING: ["CONFIRMED", "CANCELLED"],
            CONFIRMED: ["PROCESSING", "CANCELLED"],
            PROCESSING: ["SHIPPED"],
            SHIPPED: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: []
        };
        return transitions[currentStatus] || [];
    };

    const statusConfig = {
        PENDING:    { color: "text-amber-400",   border: "border-amber-400/40",   bg: "bg-amber-400/10",   dot: "bg-amber-400",   icon: "⏳" },
        CONFIRMED:  { color: "text-blue-400",    border: "border-blue-400/40",    bg: "bg-blue-400/10",    dot: "bg-blue-400",    icon: "✓"  },
        PROCESSING: { color: "text-violet-400",  border: "border-violet-400/40",  bg: "bg-violet-400/10",  dot: "bg-violet-400",  icon: "⚙️" },
        SHIPPED:    { color: "text-cyan-400",    border: "border-cyan-400/40",    bg: "bg-cyan-400/10",    dot: "bg-cyan-400",    icon: "🚚" },
        DELIVERED:  { color: "text-emerald-400", border: "border-emerald-400/40", bg: "bg-emerald-400/10", dot: "bg-emerald-400", icon: "✅" },
        CANCELLED:  { color: "text-rose-400",    border: "border-rose-400/40",    bg: "bg-rose-400/10",    dot: "bg-rose-400",    icon: "❌" },
    };

    const getStatusCfg = (s) => statusConfig[s] || statusConfig.PENDING;

    useEffect(() => { fetchOrder(); }, [id]);

    function fetchOrder() {
        setLoading(true);
        API.get(`/orders/${id}`)
            .then(res => { setOrder(res.data); setNewStatus(res.data.status); })
            .catch((err) => { console.error("Fetch error:", err); setError("Order not found or access denied."); })
            .finally(() => setLoading(false));
    }

    function validateStatusTransition(currentStatus, nextStatus) {
        if (!currentStatus || !nextStatus) return "Invalid status.";
        if (currentStatus === nextStatus) return "Please select a different status.";
        const validNext = getValidNextStatuses(currentStatus);
        if (!validNext.includes(nextStatus)) return `Cannot change from ${currentStatus} to ${nextStatus}.`;
        return "";
    }

    function validateOrderData(ord) {
        if (!ord || !ord.id) return "Invalid order data.";
        if (!ord.status) return "Order status is missing.";
        if (ord.total == null || ord.total < 0) return "Invalid order total.";
        if (!ord.items || ord.items.length === 0) return "Order has no items.";
        return "";
    }

    useEffect(() => {
        if (order && newStatus) setStatusError(validateStatusTransition(order.status, newStatus));
    }, [newStatus, order]);

    async function handleStatusUpdate() {
        setUpdateMsg("");
        const transErr = validateStatusTransition(order.status, newStatus);
        if (transErr) { setUpdateMsg(transErr); return; }
        try {
            await API.patch(`/orders/${id}/status`, { status: newStatus });
            setUpdateMsg("Status updated successfully!");
            setTimeout(() => navigate("/orders"), 1000);
        } catch (err) {
            console.error("Update error:", err);
            setUpdateMsg(`Error: ${err.response?.data?.message || err.response?.data || "Failed to update status."}`);
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading order details...</p>
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
                <Link to="/orders">
                    <button className="btn-primary justify-center w-full">← Back to Orders</button>
                </Link>
            </div>
        </div>
    );

    if (!order) return null;

    const validStatuses = getValidNextStatuses(order.status);
    const sc = getStatusCfg(order.status);
    const orderDataErr = validateOrderData(order);

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">

                {/* Back */}
                <Link to="/orders" className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all no-underline">
                    ← Back to Orders
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
                    <div>
                        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">Order Details</p>
                        <h1 className="text-4xl font-black text-white tracking-tight">Order #{order.id}</h1>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${sc.bg} ${sc.border}`}>
                        <span className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`} />
                        <span className={`font-black text-sm ${sc.color}`}>{sc.icon} {order.status}</span>
                    </div>
                </div>

                {/* Data validation error */}
                {orderDataErr && (
                    <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm font-medium">
                        <span>⚠️</span> {orderDataErr}
                    </div>
                )}

                {/* Order Info */}
                <div className="glass-card mb-6">
                    <h3 className="text-white font-black mb-7 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-base">📋</span>
                        Order Information
                    </h3>

                    <div className="grid sm:grid-cols-3 gap-6 mb-6">
                        <InfoItem label="Total Amount"  value={`$${order.total}`}           gradient />
                        <InfoItem label="Customer Email" value={order.userEmail}            />
                        <InfoItem label="Placed On"     value={order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"} />
                    </div>

                    {order.shippingAddress && (
                        <div className="p-4 bg-blue-500/[0.04] border border-blue-500/15 rounded-xl">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Shipping Address</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{order.shippingAddress}</p>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="glass-card mb-6 overflow-x-auto">
                    <h3 className="text-white font-black mb-6 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center text-base">📦</span>
                        Order Items
                        <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-slate-400 text-xs font-bold rounded-full">
                            {order.items?.length || 0}
                        </span>
                    </h3>

                    {order.items && order.items.length > 0 ? (
                        <div className="min-w-[560px]">
                            {/* Table header */}
                            <div className="grid grid-cols-[1fr_100px_80px_72px_100px] gap-3 px-4 pb-3 border-b border-white/8">
                                {["Product", "SKU", "Price", "Qty", "Total"].map((h, i) => (
                                    <p key={h} className={`text-slate-600 text-xs font-bold uppercase tracking-widest ${i > 1 ? "text-right" : ""}`}>{h}</p>
                                ))}
                            </div>

                            <div className="flex flex-col gap-2 mt-3">
                                {order.items.map(item => (
                                    <div key={item.id} className="grid grid-cols-[1fr_100px_80px_72px_100px] gap-3 px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/8 rounded-xl transition-all items-center">
                                        <p className="text-white font-bold text-sm">{item.name}</p>
                                        <p className="text-slate-500 text-xs">{item.sku}</p>
                                        <p className="text-slate-300 text-sm text-right">${item.price}</p>
                                        <div className="flex justify-end">
                                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black rounded-full">
                                                ×{item.quantity}
                                            </span>
                                        </div>
                                        <p className="text-right font-black text-sm gradient-text-price">${item.lineTotal}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-600">No items in this order</div>
                    )}
                </div>

                {/* Status Update – Admin/Vendor */}
                {(role === "ADMIN" || role === "VENDOR") && validStatuses.length > 0 && (
                    <div className={`p-6 rounded-2xl border transition-all ${
                        statusError ? "border-rose-500/40 bg-rose-500/[0.03]" : "border-emerald-500/25 bg-emerald-500/[0.03]"
                    }`}>
                        <h3 className="text-white font-black mb-1 flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-base">🔄</span>
                            Update Order Status
                        </h3>
                        <p className="text-slate-500 text-xs ml-12 mb-6">
                            Current: <span className={`font-black ${sc.color}`}>{order.status}</span>
                        </p>

                        <div className="flex flex-wrap gap-3 items-center">
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className={`flex-1 min-w-[200px] px-4 py-3 rounded-xl border text-white text-sm font-bold outline-none transition-all [color-scheme:dark] ${
                                    statusError
                                        ? "border-rose-500/60 bg-rose-500/5"
                                        : "border-white/10 bg-white/5 focus:border-emerald-400/50"
                                }`}
                            >
                                <option value={order.status}>{order.status} (current)</option>
                                {validStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>

                            <button
                                onClick={handleStatusUpdate}
                                disabled={newStatus === order.status || !!statusError}
                                title={statusError || "Update order status"}
                                className={`px-8 py-3 rounded-xl font-black text-sm text-white transition-all ${
                                    newStatus === order.status || statusError
                                        ? "bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed"
                                        : "bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300"
                                }`}
                            >
                                Update Status
                            </button>
                        </div>

                        {statusError && (
                            <p className="text-rose-400 text-xs font-semibold mt-3 flex items-center gap-1">
                                <span>⚠️</span> {statusError}
                            </p>
                        )}

                        {updateMsg && (
                            <div className={`flex items-center gap-2 mt-4 p-3 rounded-xl border text-sm font-semibold ${
                                updateMsg.includes("successfully")
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            }`}>
                                {updateMsg.includes("successfully") ? "✅" : "⚠️"} {updateMsg}
                            </div>
                        )}
                    </div>
                )}

                {/* Terminal status note */}
                {(role === "ADMIN" || role === "VENDOR") && validStatuses.length === 0 && (
                    <div className="flex items-center gap-4 p-5 bg-amber-400/[0.05] border border-amber-400/20 rounded-2xl">
                        <span className="text-2xl flex-shrink-0">ℹ️</span>
                        <p className="text-amber-300 text-sm font-semibold">
                            This order is <span className="font-black">{order.status}</span> and cannot be updated further.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

const InfoItem = ({ label, value, gradient = false }) => (
    <div>
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-lg font-black ${gradient ? "gradient-text-price" : "text-white"}`}>{value}</p>
    </div>
);