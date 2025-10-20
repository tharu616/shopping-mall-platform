import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [shippingAddress, setShippingAddress] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/cart")
            .then(res => setCart(res.data.items))
            .catch(() => setMsg("Could not load cart."));
    }, []);

    async function handleCheckout() {
        if (!shippingAddress.trim()) {
            setMsg("Please enter a shipping address.");
            return;
        }

        setLoading(true);
        setMsg("");

        const userEmail = localStorage.getItem("userEmail") || "customer@example.com";

        const order = {
            userEmail: userEmail,
            status: "PENDING",
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            shippingAddress: shippingAddress,
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
                        Add items to your cart before checkout
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
                            boxShadow: "0 8px 24px rgba(255,165,0,0.4)"
                        }}>
                            Continue Shopping
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
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "40px" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        Checkout
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        Review your order and complete your purchase
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 400px",
                    gap: "30px"
                }}>
                    {/* Left: Order Details */}
                    <div>
                        {/* Order Items - Glassmorphism */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                            marginBottom: "24px"
                        }}>
                            <h3 style={{
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "#1A1A2E",
                                marginBottom: "24px"
                            }}>
                                📦 Your Items ({cart.length})
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px",
                                        background: "rgba(30,144,255,0.05)",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(30,144,255,0.1)"
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontWeight: "700",
                                                color: "#1A1A2E",
                                                fontSize: "16px",
                                                marginBottom: "4px"
                                            }}>
                                                {item.productName || item.name}
                                            </div>
                                            <div style={{ color: "#666", fontSize: "14px" }}>
                                                ${item.price} × {item.quantity}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: "20px",
                                            fontWeight: "800",
                                            background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent"
                                        }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address - Glassmorphism */}
                        <div style={{
                            background: "linear-gradient(135deg, rgba(30,144,255,0.1), rgba(75,54,139,0.1))",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "2px solid rgba(30,144,255,0.3)",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                        }}>
                            <h3 style={{
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "#1A1A2E",
                                marginBottom: "16px"
                            }}>
                                🚚 Shipping Address
                            </h3>
                            <p style={{
                                color: "#666",
                                fontSize: "14px",
                                marginBottom: "16px"
                            }}>
                                Please provide your complete shipping address
                            </p>
                            <textarea
                                rows="4"
                                placeholder="Enter your full shipping address...&#10;Street, City, State, ZIP Code"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    background: "rgba(255,255,255,0.7)",
                                    fontSize: "15px",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                    outline: "none",
                                    transition: "all 0.3s"
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#1E90FF";
                                    e.target.style.background = "rgba(255,255,255,0.9)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(255,255,255,0.3)";
                                    e.target.style.background = "rgba(255,255,255,0.7)";
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div style={{
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                            position: "sticky",
                            top: "100px"
                        }}>
                            <h3 style={{
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "#1A1A2E",
                                marginBottom: "24px"
                            }}>
                                Order Summary
                            </h3>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                marginBottom: "24px"
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "16px"
                                }}>
                                    <span style={{ color: "#666" }}>Subtotal:</span>
                                    <span style={{ fontWeight: "700", color: "#1A1A2E" }}>
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "16px"
                                }}>
                                    <span style={{ color: "#666" }}>Shipping:</span>
                                    <span style={{ fontWeight: "700", color: "#4CAF50" }}>
                                        FREE
                                    </span>
                                </div>

                                <div style={{
                                    height: "2px",
                                    background: "linear-gradient(90deg, transparent, #e0e0e0, transparent)"
                                }} />

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "24px"
                                }}>
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

                            {/* Place Order Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "18px",
                                    background: loading
                                        ? "#ccc"
                                        : "linear-gradient(135deg, #4CAF50, #45a049)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "14px",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    boxShadow: loading
                                        ? "none"
                                        : "0 8px 24px rgba(76,175,80,0.4)",
                                    transition: "all 0.3s",
                                    marginBottom: "12px"
                                }}
                            >
                                {loading ? (
                                    <span>⏳ Processing...</span>
                                ) : (
                                    <span>✓ Place Order</span>
                                )}
                            </button>

                            {/* Back to Cart Button */}
                            <Link to="/cart">
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
                                    ← Back to Cart
                                </button>
                            </Link>

                            {/* Message Display */}
                            {msg && (
                                <div style={{
                                    marginTop: "16px",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    background: msg.includes("success")
                                        ? "rgba(76,175,80,0.15)"
                                        : "rgba(220,53,69,0.15)",
                                    border: `2px solid ${msg.includes("success") ? "#4CAF50" : "#dc3545"}`,
                                    color: msg.includes("success") ? "#4CAF50" : "#dc3545",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    textAlign: "center"
                                }}>
                                    {msg}
                                </div>
                            )}

                            {/* Security Badge */}
                            <div style={{
                                marginTop: "24px",
                                padding: "16px",
                                background: "rgba(30,144,255,0.05)",
                                borderRadius: "12px",
                                textAlign: "center",
                                border: "1px solid rgba(30,144,255,0.1)"
                            }}>
                                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔒</div>
                                <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
                                    <strong>Secure Checkout</strong><br />
                                    Your information is protected
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
