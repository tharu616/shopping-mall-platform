import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountMsg, setDiscountMsg] = useState("");
    const [cartErrors, setCartErrors] = useState({});

    useEffect(() => {
        API.get("/cart")
            .then((res) => setCart(res.data.items || []))
            .catch(() => console.error("Failed to load cart"));
    }, []);

    const applyDiscount = async () => {
        setDiscountMsg("");
        if (!discountCode.trim()) { setDiscountMsg("Please enter a discount code."); return; }
        try {
            const response = await API.get("/discounts");
            const discount = response.data.find(
                (d) => d.code.toUpperCase() === discountCode.toUpperCase().trim() && d.active === true
            );
            if (!discount) { setDiscountMsg("Invalid or inactive discount code."); setAppliedDiscount(null); return; }
            const now = new Date();
            if (discount.startsAt && new Date(discount.startsAt) > now) { setDiscountMsg("This discount is not yet valid."); setAppliedDiscount(null); return; }
            if (discount.endsAt && new Date(discount.endsAt) < now) { setDiscountMsg("This discount has expired."); setAppliedDiscount(null); return; }
            setAppliedDiscount(discount);
            setDiscountMsg(`✓ ${discount.name} (${discount.percentage}% off) applied!`);
        } catch { setDiscountMsg("Failed to verify discount code."); }
    };

    const removeDiscount = () => { setAppliedDiscount(null); setDiscountCode(""); setDiscountMsg(""); };

    const updateQuantity = async (itemId, newQty) => {
        try {
            await API.patch(`/cart/items/${itemId}`, { quantity: newQty });
            setCart((prev) => prev.map((item) => item.id === itemId ? { ...item, quantity: newQty } : item));
        } catch { alert("Failed to update quantity"); }
    };

    const removeItem = async (itemId) => {
        try {
            await API.delete(`/cart/items/${itemId}`);
            setCart((prev) => prev.filter((item) => item.id !== itemId));
        } catch { alert("Failed to remove item"); }
    };

    function validateQty(qty, maxStock) {
        const n = Number(qty);
        if (!Number.isInteger(n) || n < 1) return "Quantity must be a positive integer.";
        if (n > 99) return "Quantity cannot exceed 99.";
        if (typeof maxStock === "number" && n > maxStock) return `Only ${maxStock} in stock.`;
        return "";
    }

    function itemKey(it) { return it?.productId ?? it?.id ?? it?.sku ?? it?.name; }

    function validateCartLines(items) {
        const errors = {}; const seen = new Set();
        for (const it of items ?? []) {
            const key = itemKey(it);
            const e = validateQty(it.quantity, it.stock);
            if (e) errors[key] = e;
            if (key != null) {
                if (seen.has(key)) errors[key] = (errors[key] ? errors[key] + " " : "") + "Duplicate item in cart.";
                else seen.add(key);
            }
        }
        return errors;
    }

    useEffect(() => { setCartErrors(validateCartLines(cart)); }, [cart]);

    async function handleQtyChange(item, nextQty) {
        const msg = validateQty(nextQty, item?.stock);
        const key = itemKey(item);
        if (msg) { setCartErrors((prev) => ({ ...prev, [key]: msg })); return; }
        setCartErrors((prev) => ({ ...prev, [key]: "" }));
        await updateQuantity(item.id, nextQty);
    }

    const hasErrors = Object.values(cartErrors).some(Boolean);
    const isEmpty = !cart || cart.length === 0;

    function normalizeQtyInput(val) {
        return Math.max(1, Math.min(99, parseInt(String(val).replace(/\D+/g, "") || "0", 10)));
    }

    async function handleCheckoutClick() {
        const errs = validateCartLines(cart);
        if (Object.values(errs).some(Boolean) || isEmpty) { setCartErrors(errs); return; }
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0;
    const total = subtotal - discountAmount;

    /* ── Empty state ── */
    if (cart.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />
            <div className="relative z-10 glass-card max-w-md w-full text-center py-14 px-10">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl mx-auto mb-6">🛒</div>
                <h2 className="text-white text-3xl font-black mb-3">Your Cart is Empty</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Looks like you haven't added anything to your cart yet
                </p>
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

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Your Cart</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">Shopping Cart</h1>
                    <p className="text-slate-400 text-sm mt-2">
                        {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

                    {/* ── Cart Items ── */}
                    <div className="flex flex-col gap-4">
                        {cart.map((item) => {
                            const key = itemKey(item);
                            const errMsg = cartErrors[key];

                            return (
                                <div
                                    key={item.id}
                                    className={`bg-white/[0.03] border rounded-2xl p-5 transition-all ${
                                        errMsg ? "border-rose-500/40 bg-rose-500/[0.03]" : "border-white/10 hover:border-white/18"
                                    }`}
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#1a1040] to-[#0d0d2b] flex items-center justify-center text-4xl flex-shrink-0 border border-white/10">
                                            📦
                                        </div>

                                        {/* Name + price */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-bold text-base truncate mb-1">
                                                {item.productName || item.name}
                                            </h3>
                                            <span className="text-lg font-black gradient-text-price">
                                                ${item.price}
                                            </span>
                                        </div>

                                        {/* Qty controls */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleQtyChange(item, Math.max(1, item.quantity - 1))}
                                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 hover:border-amber-400/40 transition-all flex items-center justify-center"
                                            >
                                                −
                                            </button>
                                            <span
                                                className="text-white font-black text-base w-8 text-center"
                                                title={typeof item.stock === "number" ? `In stock: ${item.stock}` : undefined}
                                            >
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQtyChange(item, item.quantity + 1)}
                                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 hover:border-amber-400/40 transition-all flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Line total */}
                                        <div className="text-white font-black text-lg min-w-[72px] text-right flex-shrink-0">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all flex items-center justify-center flex-shrink-0 text-base"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    {/* Validation error */}
                                    {errMsg && (
                                        <p className="text-rose-400 text-xs font-semibold mt-3 flex items-center gap-1">
                                            <span>⚠️</span> {errMsg}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Right sidebar ── */}
                    <div className="flex flex-col gap-5 lg:sticky lg:top-6">

                        {/* Discount Code */}
                        <div className="p-6 rounded-2xl border-2 border-dashed border-amber-400/25 bg-amber-400/[0.03]">
                            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                                <span>🎁</span> Discount Code
                            </h3>

                            {!appliedDiscount ? (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && applyDiscount()}
                                        placeholder="ENTER CODE"
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 text-sm font-bold uppercase tracking-widest outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                                    />
                                    <button
                                        onClick={applyDiscount}
                                        className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-sm transition-all"
                                    >
                                        Apply Code
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                    <div>
                                        <p className="text-emerald-400 font-black text-sm">✓ {appliedDiscount.name}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{appliedDiscount.percentage}% off applied</p>
                                    </div>
                                    <button
                                        onClick={removeDiscount}
                                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {discountMsg && (
                                <div className={`flex items-center gap-2 mt-3 p-3 rounded-xl text-xs font-semibold ${
                                    discountMsg.includes("✓")
                                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                                        : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                                }`}>
                                    <span>{discountMsg.includes("✓") ? "✅" : "⚠️"}</span> {discountMsg}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="glass-card">
                            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6">Order Summary</h3>

                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                                </div>

                                {appliedDiscount && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-400 font-semibold">
                                            Discount ({appliedDiscount.percentage}%)
                                        </span>
                                        <span className="text-emerald-400 font-bold">−${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="h-px bg-white/10" />

                                <div className="flex justify-between">
                                    <span className="text-white font-black text-lg">Total</span>
                                    <span className="text-2xl font-black gradient-text-price">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Proceed to Checkout */}
                            <Link to="/checkout">
                                <button className="btn-primary w-full justify-center py-4 text-base mb-3">
                                    Proceed to Checkout
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>

                            {/* Continue Shopping */}
                            <Link to="/products">
                                <button className="btn-ghost w-full justify-center py-3 mb-3">
                                    ← Continue Shopping
                                </button>
                            </Link>

                            {/* Validation-gated checkout */}
                            <button
                                onClick={handleCheckoutClick}
                                disabled={hasErrors || isEmpty}
                                title={
                                    isEmpty ? "Your cart is empty."
                                    : hasErrors ? "Please resolve cart item errors before checkout."
                                    : "Checkout"
                                }
                                className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                    hasErrors || isEmpty
                                        ? "bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed"
                                        : "bg-white/8 border border-white/15 text-white hover:bg-white/12"
                                }`}
                            >
                                {hasErrors ? (
                                    <><span>⚠️</span> Fix errors to checkout</>
                                ) : (
                                    <><span>✓</span> Checkout</>
                                )}
                            </button>

                            {hasErrors && (
                                <p className="text-rose-400 text-xs text-center mt-3 font-semibold">
                                    Please resolve item errors above
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}