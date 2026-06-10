import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [shippingAddress, setShippingAddress] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkoutErrors, setCheckoutErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/cart")
            .then(res => setCart(res.data.items))
            .catch(() => setMsg("Could not load cart."));
    }, []);

    function validateAddress(addr) {
        const trimmed = (addr || "").trim();
        if (!trimmed) return "Shipping address is required.";
        if (trimmed.length < 10) return "Please enter a complete address (min. 10 characters).";
        if (trimmed.length > 500) return "Address is too long (max. 500 characters).";
        return "";
    }

    function validateCart(items) {
        if (!items || items.length === 0) return "Your cart is empty. Add items before checkout.";
        for (const it of items) {
            if (!it.quantity || it.quantity < 1) return `Invalid quantity for ${it.productName || it.name}.`;
            if (it.price == null || it.price < 0) return `Invalid price for ${it.productName || it.name}.`;
        }
        return "";
    }

    function validateTotal(items) {
        if (!items || items.length === 0) return "";
        const sum = items.reduce((s, it) => s + (it.price * it.quantity), 0);
        if (sum <= 0) return "Order total must be greater than zero.";
        if (sum > 1000000) return "Order total exceeds maximum allowed amount.";
        return "";
    }

    function validateCheckout() {
        const errors = {};
        const addrErr = validateAddress(shippingAddress);
        const cartErr = validateCart(cart);
        const totalErr = validateTotal(cart);
        if (addrErr) errors.address = addrErr;
        if (cartErr) errors.cart = cartErr;
        if (totalErr) errors.total = totalErr;
        return errors;
    }

    useEffect(() => { setCheckoutErrors(validateCheckout()); }, [shippingAddress, cart]);

    async function handleCheckout() {
        const errs = validateCheckout();
        if (Object.keys(errs).length > 0) { setCheckoutErrors(errs); setMsg("Please fix the errors below before placing your order."); return; }
        setLoading(true); setMsg("");
        const userEmail = localStorage.getItem("userEmail") || "customer@example.com";
        const order = {
            userEmail,
            status: "PENDING",
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            shippingAddress,
            items: cart.map(item => ({
                id: item.id,
                productId: item.productId || item.id,
                sku: item.sku,
                name: item.productName || item.name,
                price: item.price,
                quantity: item.quantity,
                lineTotal: item.price * item.quantity
            }))
        };
        try {
            await API.post("/orders", order);
            setMsg("Order placed successfully!");
            setTimeout(() => navigate("/orders"), 1200);
        } catch (e) {
            setMsg("Checkout failed. Please check your cart and try again.");
        }
        setLoading(false);
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hasErrors = Object.keys(checkoutErrors).length > 0;

    /* ── Empty cart ── */
    if (cart.length === 0 && !checkoutErrors.cart) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />
            <div className="relative z-10 glass-card max-w-md w-full text-center py-14 px-10">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl mx-auto mb-6">🛒</div>
                <h2 className="text-white text-3xl font-black mb-3">Your Cart is Empty</h2>
                <p className="text-slate-400 text-sm mb-8">Add items to your cart before checkout</p>
                <Link to="/products">
                    <button className="btn-primary w-full justify-center py-4 text-base">
                        Continue Shopping
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </Link>
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
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Final Step</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">Checkout</h1>
                    <p className="text-slate-400 text-sm mt-2">Review your order and complete your purchase</p>
                </div>

                {/* Global error banner */}
                {msg && (
                    <div className={`flex items-center gap-3 p-4 mb-8 rounded-xl text-sm font-medium ${
                        msg.includes("successfully")
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    }`}>
                        <span>{msg.includes("successfully") ? "✅" : "⚠️"}</span> {msg}
                    </div>
                )}

                <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

                    {/* ── Left column ── */}
                    <div className="flex flex-col gap-6">

                        {/* Order Items */}
                        <div className="glass-card">
                            <h3 className="text-white font-black mb-6 flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-base">📦</span>
                                Your Items
                                <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-slate-400 text-xs font-bold rounded-full">
                                    {cart.length}
                                </span>
                            </h3>

                            <div className="flex flex-col gap-3">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between gap-4 p-4 bg-white/[0.02] border border-white/8 rounded-xl">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                                                📦
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-bold text-sm truncate">{item.productName || item.name}</p>
                                                <p className="text-slate-500 text-xs">${item.price} × {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-white font-black text-base flex-shrink-0 gradient-text-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {checkoutErrors.cart && (
                                <p className="text-rose-400 text-xs font-semibold mt-4 flex items-center gap-1">
                                    <span>⚠️</span> {checkoutErrors.cart}
                                </p>
                            )}
                        </div>

                        {/* Shipping Address */}
                        <div className={`p-6 rounded-2xl border transition-all ${
                            checkoutErrors.address
                                ? "border-rose-500/40 bg-rose-500/[0.03]"
                                : "border-blue-500/20 bg-blue-500/[0.03]"
                        }`}>
                            <h3 className="text-white font-black mb-1 flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-base">🚚</span>
                                Shipping Address
                            </h3>
                            <p className="text-slate-500 text-xs mb-5 ml-12">Enter your complete delivery address</p>

                            <textarea
                                rows={4}
                                placeholder={`Enter your full shipping address...\nStreet, City, State, ZIP Code`}
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border text-white placeholder-slate-600 text-sm outline-none transition-all resize-none font-inherit ${
                                    checkoutErrors.address
                                        ? "border-rose-500/60 bg-rose-500/5 focus:border-rose-400"
                                        : "border-white/10 bg-white/5 focus:border-blue-400/50 focus:bg-white/8"
                                }`}
                            />
                            <div className="flex justify-between mt-2">
                                {checkoutErrors.address
                                    ? <p className="text-rose-400 text-xs font-semibold flex items-center gap-1"><span>⚠️</span> {checkoutErrors.address}</p>
                                    : <span />
                                }
                                <span className={`text-xs ${shippingAddress.length > 500 ? "text-rose-400" : "text-slate-600"}`}>
                                    {shippingAddress.length} / 500
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="glass-card lg:sticky lg:top-6">
                        <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6">Order Summary</h3>

                        {/* Line items summary */}
                        <div className="flex flex-col gap-3 mb-5">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-xs">
                                    <span className="text-slate-400 truncate mr-3">
                                        {item.productName || item.name} × {item.quantity}
                                    </span>
                                    <span className="text-white font-semibold flex-shrink-0">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-white/10 mb-5" />

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-white font-black text-lg">Total</span>
                            <span className="text-2xl font-black gradient-text-price">${total.toFixed(2)}</span>
                        </div>

                        {/* Validation errors list */}
                        {hasErrors && (
                            <div className="mb-5 p-4 bg-rose-500/8 border border-rose-500/20 rounded-xl">
                                <p className="text-rose-400 text-xs font-black uppercase tracking-wider mb-2">Fix before placing order</p>
                                {Object.values(checkoutErrors).filter(Boolean).map((err, i) => (
                                    <p key={i} className="text-rose-300 text-xs flex items-start gap-1 mt-1">
                                        <span className="flex-shrink-0">•</span> {err}
                                    </p>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={loading || hasErrors}
                            className={`btn-primary w-full justify-center py-4 text-base mb-3 ${
                                (loading || hasErrors) ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    Place Order
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <Link to="/cart">
                            <button className="btn-ghost w-full justify-center py-3">
                                ← Back to Cart
                            </button>
                        </Link>

                        {/* Trust badges */}
                        <div className="mt-6 pt-5 border-t border-white/8 grid grid-cols-3 gap-3 text-center">
                            {[["🔒", "Secure"], ["📦", "Fast Ship"], ["↩️", "Easy Returns"]].map(([icon, label]) => (
                                <div key={label}>
                                    <div className="text-lg mb-1">{icon}</div>
                                    <p className="text-slate-600 text-xs font-semibold">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}