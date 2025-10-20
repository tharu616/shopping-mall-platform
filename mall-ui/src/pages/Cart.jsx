import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountMsg, setDiscountMsg] = useState("");

    useEffect(() => {
        API.get("/cart")
            .then(res => setCart(res.data.items || []))
            .catch(() => console.error("Failed to load cart"));
    }, []);

    const applyDiscount = async () => {
        setDiscountMsg("");
        if (!discountCode.trim()) {
            setDiscountMsg("Please enter a discount code.");
            return;
        }

        try {
            const response = await API.get("/discounts");
            const discount = response.data.find(d =>
                d.code.toUpperCase() === discountCode.toUpperCase().trim() &&
                d.active === true
            );

            if (!discount) {
                setDiscountMsg("Invalid or inactive discount code.");
                setAppliedDiscount(null);
                return;
            }

            const now = new Date();
            if (discount.startsAt && new Date(discount.startsAt) > now) {
                setDiscountMsg("This discount is not yet valid.");
                setAppliedDiscount(null);
                return;
            }
            if (discount.endsAt && new Date(discount.endsAt) < now) {
                setDiscountMsg("This discount has expired.");
                setAppliedDiscount(null);
                return;
            }

            setAppliedDiscount(discount);
            setDiscountMsg(`✓ ${discount.name} (${discount.percentage}% off) applied!`);
        } catch {
            setDiscountMsg("Failed to verify discount code.");
        }
    };

    const removeDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode("");
        setDiscountMsg("");
    };

    const updateQuantity = async (itemId, newQty) => {
        try {
            await API.patch(`/cart/items/${itemId}`, { quantity: newQty });
            setCart(cart.map(item =>
                item.id === itemId ? { ...item, quantity: newQty } : item
            ));
        } catch {
            alert("Failed to update quantity");
        }
    };

    const removeItem = async (itemId) => {
        try {
            await API.delete(`/cart/items/${itemId}`);
            setCart(cart.filter(item => item.id !== itemId));
        } catch {
            alert("Failed to remove item");
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage / 100) : 0;
    const total = subtotal - discountAmount;

    if (cart.length === 0) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Background decoration */}
                <div style={{
                    position: "absolute",
                    top: "-10%",
                    right: "-5%",
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, rgba(255,165,0,0.2), transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)"
                }} />

                <div style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "24px",
                    padding: "60px 80px",
                    textAlign: "center",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                    zIndex: 1
                }}>
                    <div style={{ fontSize: "120px", marginBottom: "24px" }}>🛒</div>
                    <h2 style={{ fontSize: "32px", color: "white", marginBottom: "16px", fontWeight: "800" }}>
                        Your Cart is Empty
                    </h2>
                    <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", marginBottom: "30px" }}>
                        Looks like you haven't added anything to your cart yet
                    </p>
                    <Link to="/products">
                        <button style={{
                            padding: "16px 40px",
                            background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "18px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 8px 24px rgba(255,165,0,0.4)",
                            transition: "all 0.3s"
                        }}>
                            Start Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "40px" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        Shopping Cart
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 400px",
                    gap: "30px"
                }}>
                    {/* Left: Cart Items */}
                    <div>
                        {cart.map(item => (
                            <div key={item.id} style={{
                                background: "white",
                                borderRadius: "16px",
                                padding: "24px",
                                marginBottom: "16px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                display: "flex",
                                gap: "20px",
                                alignItems: "center"
                            }}>
                                {/* Product Image */}
                                <div style={{
                                    width: "100px",
                                    height: "100px",
                                    background: "linear-gradient(135deg, #f5f7fa, #e8ebf0)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "48px",
                                    flexShrink: 0
                                }}>
                                    📦
                                </div>

                                {/* Product Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        color: "#1A1A2E",
                                        marginBottom: "8px"
                                    }}>
                                        {item.productName || item.name}
                                    </h3>
                                    <p style={{
                                        fontSize: "24px",
                                        fontWeight: "800",
                                        background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}>
                                        ${item.price}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "8px",
                                            border: "2px solid #1E90FF",
                                            background: "white",
                                            color: "#1E90FF",
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        −
                                    </button>
                                    <span style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        minWidth: "30px",
                                        textAlign: "center",
                                        color: "#1A1A2E"
                                    }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "8px",
                                            border: "2px solid #1E90FF",
                                            background: "white",
                                            color: "#1E90FF",
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div style={{
                                    fontSize: "22px",
                                    fontWeight: "800",
                                    color: "#1A1A2E",
                                    minWidth: "80px",
                                    textAlign: "right"
                                }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "rgba(220,53,69,0.1)",
                                        color: "#dc3545",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.3s"
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right: Summary */}
                    <div>
                        {/* Discount Code Section - Glassmorphism */}
                        <div style={{
                            background: "linear-gradient(135deg, rgba(255,165,0,0.15), rgba(30,144,255,0.15))",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "2px dashed rgba(255,165,0,0.5)",
                            borderRadius: "20px",
                            padding: "24px",
                            marginBottom: "24px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                        }}>
                            <h3 style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#1A1A2E",
                                marginBottom: "16px"
                            }}>
                                🎁 Have a Discount Code?
                            </h3>

                            {!appliedDiscount ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="Enter discount code"
                                        style={{
                                            padding: "14px 18px",
                                            borderRadius: "12px",
                                            border: "2px solid rgba(255,255,255,0.3)",
                                            background: "rgba(255,255,255,0.5)",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            textTransform: "uppercase",
                                            outline: "none"
                                        }}
                                    />
                                    <button
                                        onClick={applyDiscount}
                                        style={{
                                            padding: "14px",
                                            background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 15px rgba(76,175,80,0.3)",
                                            transition: "all 0.3s"
                                        }}
                                    >
                                        Apply Code
                                    </button>
                                </div>
                            ) : (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "16px",
                                    background: "rgba(76,175,80,0.2)",
                                    borderRadius: "12px",
                                    border: "2px solid #4CAF50"
                                }}>
                                    <div>
                                        <div style={{ color: "#4CAF50", fontWeight: "700", fontSize: "16px" }}>
                                            ✓ {appliedDiscount.name}
                                        </div>
                                        <div style={{ color: "#666", fontSize: "14px" }}>
                                            {appliedDiscount.percentage}% off
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeDiscount}
                                        style={{
                                            padding: "8px 16px",
                                            background: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {discountMsg && (
                                <div style={{
                                    marginTop: "12px",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    background: discountMsg.includes("✓")
                                        ? "rgba(76,175,80,0.2)"
                                        : "rgba(220,53,69,0.2)",
                                    color: discountMsg.includes("✓") ? "#4CAF50" : "#dc3545",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    border: `2px solid ${discountMsg.includes("✓") ? "#4CAF50" : "#dc3545"}`
                                }}>
                                    {discountMsg}
                                </div>
                            )}
                        </div>

                        {/* Order Summary - Glassmorphism */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                        }}>
                            <h3 style={{
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "#1A1A2E",
                                marginBottom: "24px"
                            }}>
                                Order Summary
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                                    <span style={{ color: "#666" }}>Subtotal:</span>
                                    <span style={{ fontWeight: "700", color: "#1A1A2E" }}>${subtotal.toFixed(2)}</span>
                                </div>

                                {appliedDiscount && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                                        <span style={{ color: "#4CAF50", fontWeight: "600" }}>
                                            Discount ({appliedDiscount.percentage}%):
                                        </span>
                                        <span style={{ color: "#4CAF50", fontWeight: "700" }}>
                                            -${discountAmount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div style={{
                                    height: "2px",
                                    background: "linear-gradient(90deg, transparent, #e0e0e0, transparent)"
                                }} />

                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "24px" }}>
                                    <span style={{ fontWeight: "800", color: "#1A1A2E" }}>Total:</span>
                                    <span style={{
                                        fontWeight: "800",
                                        background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}>
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Link to="/checkout">
                                <button style={{
                                    width: "100%",
                                    padding: "18px",
                                    background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "14px",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    boxShadow: "0 8px 24px rgba(30,144,255,0.4)",
                                    transition: "all 0.3s",
                                    marginBottom: "12px"
                                }}>
                                    Proceed to Checkout →
                                </button>
                            </Link>

                            <Link to="/products">
                                <button style={{
                                    width: "100%",
                                    padding: "14px",
                                    background: "transparent",
                                    color: "#1E90FF",
                                    border: "2px solid #1E90FF",
                                    borderRadius: "14px",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    transition: "all 0.3s"
                                }}>
                                    ← Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
