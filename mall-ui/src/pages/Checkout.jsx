import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        // Validate shipping address
        if (!shippingAddress.trim()) {
            setMsg("Please enter a shipping address.");
            return;
        }

        setLoading(true);
        setMsg("");

        // Get user email from localStorage or auth context
        const userEmail = localStorage.getItem("userEmail") || "customer@example.com";

        // Build order data
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

    if (cart.length === 0) {
        return <div>Your cart is empty!</div>;
    }

    return (
        <div>
            <h2>Checkout</h2>

            {/* Cart Summary */}
            <h3>Your Items:</h3>
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        <b>{item.productName || item.name}</b> &times; {item.quantity} = ${item.price * item.quantity}
                    </li>
                ))}
            </ul>

            <p><b>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</b></p>

            {/* Shipping Address Input */}
            <div style={{ marginTop: "20px" }}>
                <label>
                    <b>Shipping Address:</b>
                    <textarea
                        rows="3"
                        style={{ width: "100%", marginTop: "8px" }}
                        placeholder="Enter your full shipping address..."
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                    />
                </label>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handleCheckout}
                disabled={loading}
                style={{ marginTop: "16px" }}
            >
                {loading ? "Processing..." : "Place Order"}
            </button>

            <div style={{ color: msg.includes("success") ? "green" : "red", marginTop: "10px" }}>
                {msg}
            </div>
        </div>
    );
}
