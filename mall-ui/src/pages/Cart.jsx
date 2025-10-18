import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    function fetchCart() {
        API.get("/cart")
            .then(res => setCart(res.data.items))
            .catch(() => setMsg("Couldn't load cart."));
    }

    useEffect(() => { fetchCart(); }, []);

    async function handleQtyChange(item, qty) {
        await API.put(`/cart/items/${item.id}`, { quantity: qty });
        fetchCart();
    }

    async function handleRemove(item) {
        await API.delete(`/cart/items/${item.id}`);
        fetchCart();
    }

    function handleCheckout() {
        navigate("/checkout");
    }

    return (
        <div>
            <h2>Shopping Cart</h2>
            {msg && <div>{msg}</div>}
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        <b>{item.productName}</b>
                        {` — ${item.price} x `}
                        <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e => handleQtyChange(item, Number(e.target.value))}
                            style={{ width: "60px" }}
                        />
                        <button onClick={() => handleRemove(item)}>Remove</button>
                    </li>
                ))}
            </ul>
            {cart.length === 0 && <div>No items in cart.</div>}
            {cart.length > 0 && (
                <button onClick={handleCheckout}>Checkout</button>
            )}
        </div>
    );
}
