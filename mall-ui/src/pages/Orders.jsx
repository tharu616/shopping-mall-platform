import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        API.get("/orders").then(res => setOrders(res.data));
    }, []);

    return (
        <div>
            <h2>Your Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        Order #{order.id} — Status: {order.status} — Items: {order.items.length}
                        <Link to={`/orders/${order.id}`}>[Details]</Link>
                    </li>
                ))}
            </ul>
            {orders.length === 0 && <div>No orders found.</div>}
        </div>
    );
}
