import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function UploadPayment() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [reference, setReference] = useState("");
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardExpiryDate, setCardExpiryDate] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [branchCode, setBranchCode] = useState("");
    const [transferDate, setTransferDate] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [paypalTransactionId, setPaypalTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => { fetchOrders(); }, []);

    async function fetchOrders() {
        setLoadingOrders(true);
        try {
            const res = await API.get("/orders/me");
            console.log("Orders API Response:", res.data);
            const availableOrders = res.data.filter(o =>
                o.status !== "CANCELLED" && o.status !== "DELIVERED"
            );
            console.log("Filtered available orders:", availableOrders);
            setOrders(availableOrders);
            if (availableOrders.length === 0) setMessage("ℹ️ No orders available for payment");
        } catch (err) {
            console.error("Error fetching orders:", err);
            setMessage("❌ Failed to load orders: " + (err.response?.data?.message || err.message));
        } finally {
            setLoadingOrders(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true); setMessage("");
        try {
            const payload = {
                orderId: parseInt(selectedOrder),
                paymentMethod,
                amount: parseFloat(amount),
                reference: reference || undefined,
                receiptUrl: receiptUrl || undefined,
                ...(paymentMethod === "CARD" && { cardNumber, cardHolderName, cardExpiryDate, cardCvv }),
                ...(paymentMethod === "BANK_TRANSFER" && { bankName, accountNumber, accountHolderName, branchCode, transferDate }),
                ...(paymentMethod === "PAYPAL" && { paypalEmail, paypalTransactionId })
            };
            console.log("Submitting payment:", payload);
            await API.post("/payments/upload", payload);
            setMessage("✓ Payment submitted successfully!");
            setTimeout(() => navigate("/payments"), 2000);
        } catch (err) {
            console.error("Payment error:", err);
            setMessage("❌ " + (err.response?.data?.message || "Failed to submit payment"));
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all";

    const paymentMethods = [
        { value: "CARD",             icon: "💳", label: "Credit/Debit Card",  grad: "from-blue-500 to-violet-600"   },
        { value: "BANK_TRANSFER",    icon: "🏦", label: "Bank Transfer",       grad: "from-emerald-500 to-teal-600"  },
        { value: "PAYPAL",           icon: "💰", label: "PayPal",              grad: "from-amber-400 to-orange-500"  },
        { value: "CASH_ON_DELIVERY", icon: "💵", label: "Cash on Delivery",    grad: "from-violet-500 to-purple-700" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            {/* Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate("/payments")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
                >
                    ← Back to Payments
                </button>

                {/* Title */}
                <div className="mb-10">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Checkout</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">Upload Payment</h1>
                    <p className="text-slate-400 text-sm mt-2">Submit your payment proof for order verification</p>
                </div>

                {/* Global message */}
                {message && (
                    <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl text-sm font-medium ${
                        message.includes("✓") ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                        : message.includes("ℹ️") ? "bg-blue-500/10 border border-blue-500/30 text-blue-300"
                        : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    }`}>
                        <span className="text-lg">{message.includes("✓") ? "✅" : message.includes("ℹ️") ? "ℹ️" : "⚠️"}</span>
                        {message}
                    </div>
                )}

                <div className="glass-card">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-7">

                        {/* Select Order */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
                                Select Order <span className="text-rose-400">*</span>
                            </label>
                            {loadingOrders ? (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm">
                                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                                    Loading orders...
                                </div>
                            ) : (
                                <select
                                    value={selectedOrder}
                                    onChange={(e) => {
                                        const orderId = e.target.value;
                                        setSelectedOrder(orderId);
                                        const order = orders.find(o => o.id === parseInt(orderId));
                                        if (order?.totalAmount) setAmount(order.totalAmount.toString());
                                    }}
                                    required
                                    className={`${inputClass} cursor-pointer`}
                                >
                                    <option value="" className="bg-[#1a1040]">
                                        -- Select an Order ({orders.length} available) --
                                    </option>
                                    {orders.map(order => (
                                        <option key={order.id} value={order.id} className="bg-[#1a1040]">
                                            Order #{order.id} — ${(order.totalAmount || 0).toFixed(2)} — {order.status}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {orders.length === 0 && !loadingOrders && (
                                <p className="text-slate-500 text-xs mt-2">No orders available. Please place an order first.</p>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
                                Payment Method <span className="text-rose-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {paymentMethods.map(method => (
                                    <div
                                        key={method.value}
                                        onClick={() => setPaymentMethod(method.value)}
                                        className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 text-center ${
                                            paymentMethod === method.value
                                                ? "border-amber-400/50 bg-amber-400/5"
                                                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                                        }`}
                                    >
                                        {paymentMethod === method.value && (
                                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black text-xs font-black">✓</div>
                                        )}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.grad} flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg`}>
                                            {method.icon}
                                        </div>
                                        <p className={`text-sm font-bold ${paymentMethod === method.value ? "text-white" : "text-slate-400"}`}>
                                            {method.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Amount + Reference */}
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Amount Paid <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                                    <input type="number" step="0.01" value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00" required className={`${inputClass} pl-8`} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Reference / Transaction ID
                                </label>
                                <input type="text" value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="TXN123456789" className={inputClass} />
                            </div>
                        </div>

                        {/* ── CARD FIELDS ── */}
                        {paymentMethod === "CARD" && (
                            <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex flex-col gap-5">
                                <h3 className="text-white font-black flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">💳</span>
                                    Card Details
                                </h3>
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Card Number <span className="text-rose-400">*</span></label>
                                    <input type="text" value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                                        placeholder="1234 5678 9012 3456" maxLength="16" required className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Cardholder Name <span className="text-rose-400">*</span></label>
                                    <input type="text" value={cardHolderName}
                                        onChange={(e) => setCardHolderName(e.target.value)}
                                        placeholder="John Doe" required className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Expiry <span className="text-rose-400">*</span></label>
                                        <input type="text" value={cardExpiryDate}
                                            onChange={(e) => setCardExpiryDate(e.target.value)}
                                            placeholder="MM/YY" maxLength="5" required className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">CVV <span className="text-rose-400">*</span></label>
                                        <input type="text" value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value)}
                                            placeholder="123" maxLength="3" required className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── BANK TRANSFER FIELDS ── */}
                        {paymentMethod === "BANK_TRANSFER" && (
                            <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col gap-5">
                                <h3 className="text-white font-black flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">🏦</span>
                                    Bank Transfer Details
                                </h3>
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Bank Name <span className="text-rose-400">*</span></label>
                                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Bank of America" required className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Account Number <span className="text-rose-400">*</span></label>
                                    <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" required className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Account Holder <span className="text-rose-400">*</span></label>
                                    <input type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="John Doe" required className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Branch Code</label>
                                        <input type="text" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} placeholder="001" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Transfer Date</label>
                                        <input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
                                    </div>
                                </div>
                                {/* Receipt upload */}
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">Upload Receipt (Optional)</label>
                                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-emerald-400/30 transition-all cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📎</div>
                                        <p className="text-white text-sm font-semibold">{receiptFile ? receiptFile.name : "Click to upload"}</p>
                                        <p className="text-slate-500 text-xs">Image or PDF, for verification</p>
                                        <input type="file" onChange={(e) => setReceiptFile(e.target.files[0])} accept="image/*,.pdf" className="hidden" />
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* ── PAYPAL FIELDS ── */}
                        {paymentMethod === "PAYPAL" && (
                            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col gap-5">
                                <h3 className="text-white font-black flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">💰</span>
                                    PayPal Details
                                </h3>
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">PayPal Email <span className="text-rose-400">*</span></label>
                                    <input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="your@email.com" required className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Transaction ID <span className="text-rose-400">*</span></label>
                                    <input type="text" value={paypalTransactionId} onChange={(e) => setPaypalTransactionId(e.target.value)} placeholder="1AB23456CD789012E" required className={inputClass} />
                                    <p className="text-slate-500 text-xs mt-2">Find this in your PayPal transaction history</p>
                                </div>
                            </div>
                        )}

                        {/* ── CASH ON DELIVERY ── */}
                        {paymentMethod === "CASH_ON_DELIVERY" && (
                            <div className="p-6 bg-violet-500/5 border border-violet-500/20 rounded-2xl text-center">
                                <div className="w-16 h-16 rounded-2xl bg-violet-500/15 flex items-center justify-center text-4xl mx-auto mb-4">💵</div>
                                <h3 className="text-white font-black text-lg mb-2">Cash on Delivery</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    You will pay in cash when your order is delivered.<br/>No upfront payment required!
                                </p>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={loading || !selectedOrder || !paymentMethod || loadingOrders}
                                className={`btn-primary w-full justify-center py-4 text-base ${
                                    (loading || !selectedOrder || !paymentMethod || loadingOrders)
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Upload Payment
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/payments")}
                                className="btn-ghost w-full justify-center py-4"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}