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

            // Check date validity
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

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage / 100) : 0;
    const total = subtotal - discountAmount;

    // ... rest of your cart code (update/remove functions)

    if (cart.length === 0) {
        return <div>Your cart is empty!</div>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Shopping Cart</h2>

            {/* Cart Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <thead>
                <tr style={{ backgroundColor: "#e0e0e0" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Product</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Price</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>Quantity</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cart.map(item => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "10px" }}><b>{item.productName || item.name}</b></td>
                        <td style={{ padding: "10px", textAlign: "right" }}>${item.price}</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>{item.quantity}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}><b>${item.price * item.quantity}</b></td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                            {/* Update/Remove buttons */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Discount Code Section */}
            <div style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "2px dashed #4CAF50"
            }}>
                <h3>Have a Discount Code?</h3>
                {!appliedDiscount ? (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter discount code"
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                textTransform: "uppercase"
                            }}
                        />
                        <button
                            onClick={applyDiscount}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Apply
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#28a745", fontWeight: "bold" }}>
                            ✓ {appliedDiscount.name} ({appliedDiscount.percentage}% off)
                        </span>
                        <button
                            onClick={removeDiscount}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Remove
                        </button>
                    </div>
                )}
                {discountMsg && (
                    <p style={{
                        marginTop: "10px",
                        color: discountMsg.includes("✓") ? "#28a745" : "#dc3545",
                        fontWeight: "bold"
                    }}>
                        {discountMsg}
                    </p>
                )}
            </div>

            {/* Cart Summary */}
            <div style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#28a745" }}>
                        <span>Discount ({appliedDiscount.percentage}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <Link to="/checkout">
                <button style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}>
                    Proceed to Checkout
                </button>
            </Link>
        </div>
    );
}
