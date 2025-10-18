import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
// If you have useAuth or similar, import it to get the current user's email
import { useAuth } from "../AuthContext";

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // Replace this with your actual user fetching logic
    const { user } = useAuth();

    useEffect(() => {
        API.get("/cart")
            .then(res => setCart(res.data.items))
            .catch(() => setMsg("Could not load cart."));
    }, []);

    async function handleCheckout() {
        setLoading(true);
        setMsg("");

        // Get user email -- replace this line with: user.email if you use AuthContext
        const userEmail = localStorage.getItem("userEmail") || "demo@email.com";

        // Build order data
        const order = {
            userEmail: userEmail,
            status: "PENDING",
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            shippingAddress: null,
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
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        <b>{item.productName || item.name}</b> &times; {item.quantity}
                    </li>
                ))}
            </ul>
            <button onClick={handleCheckout} disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
            </button>
            <div>{msg}</div>
        </div>
    );
}
