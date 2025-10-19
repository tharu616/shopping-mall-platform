import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ReviewList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [text, setText] = useState("");
    const [msg, setMsg] = useState("");
    const { role, user } = useAuth();

    function fetchReviews() {
        API.get(`/products/${productId}/reviews`)
            .then(res => setReviews(res.data));
    }

    useEffect(() => { fetchReviews(); }, [productId]);

    async function handleAdd(e) {
        e.preventDefault();
        try {
            await API.post(`/products/${productId}/reviews`, { comment: text });
            setText("");
            setMsg("Review added!");
            fetchReviews();
        } catch {
            setMsg("Failed to add review.");
        }
    }

    async function handleDelete(id) {
        await API.delete(`/reviews/${id}`);
        fetchReviews();
    }

    return (
        <div>
            <h3>Reviews</h3>
            <ul>
                {reviews.map(r => (
                    <li key={r.id}>
                        <b>{r.userName || r.userId}</b>: {r.comment}
                        {user?.id === r.userId && (
                            <button onClick={() => handleDelete(r.id)} style={{marginLeft: 8}}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
            {role === "CUSTOMER" && (
                <form onSubmit={handleAdd}>
                    <input
                        value={text}
                        placeholder="Write a review..."
                        onChange={e => setText(e.target.value)}
                        required
                    />
                    <button type="submit">Add Review</button>
                    <div>{msg}</div>
                </form>
            )}
        </div>
    );
}
