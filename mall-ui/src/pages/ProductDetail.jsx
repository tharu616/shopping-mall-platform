import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { role } = useAuth();
    const navigate = useNavigate();

    // Add to Cart state
    const [qty, setQty] = useState(1);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        API.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(() => setError("Product not found"))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDelete() {
        if (window.confirm("Delete product?")) {
            await API.delete(`/products/${id}`);
            navigate("/products");
        }
    }

    async function handleAddToCart() {
        try {
            await API.post("/cart/items", {
                productId: product.id,
                quantity: qty
            });
            setMsg("Added to cart!");
        } catch {
            setMsg("Failed to add to cart.");
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return null;

    return (
        <div>
            <h2>{product.name}</h2>
            <p><b>Price:</b> ${product.price}</p>
            <p><b>Description:</b> {product.description}</p>
            <p><b>Stock:</b> {product.stock}</p>
            <p><b>SKU:</b> {product.sku}</p>
            <p><b>Category:</b> {product.categoryId}</p>
            {/* Add more fields if your backend returns them */}

            {/* Add to Cart for Customers */}
            {role === "CUSTOMER" && (
                <div>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            min={1}
                            value={qty}
                            onChange={e => setQty(Number(e.target.value))}
                            style={{ width: "60px", marginLeft: "8px" }}
                        />
                    </label>
                    <button onClick={handleAddToCart} style={{ marginLeft: "8px" }}>
                        Add to Cart
                    </button>
                    <div>{msg}</div>
                </div>
            )}

            {/* Edit/Delete for Vendors/Admins */}
            {(role === "VENDOR" || role === "ADMIN") && (
                <div>
                    <Link to={`/products/${id}/edit`}><button>Edit</button></Link>
                    <button onClick={handleDelete} style={{ marginLeft: 12 }}>Delete</button>
                </div>
            )}

            <Link to="/products">Back to list</Link>
        </div>
    );
}
