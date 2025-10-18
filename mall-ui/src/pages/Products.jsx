import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();

    useEffect(() => {
        API.get("/products")
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading products...</div>;

    return (
        <div>
            <h2>Products</h2>
            {role === "VENDOR" || role === "ADMIN" ? (
                <Link to="/products/new">
                    <button>Add New Product</button>
                </Link>
            ) : null}
            <ul>
                {products.length === 0 && <li>No products found.</li>}
                {products.map(prod => (
                    <li key={prod.id}>
                        <Link to={`/products/${prod.id}`}>{prod.name}</Link>
                        {"  "}(${prod.price})
                        {role === "VENDOR" || role === "ADMIN" ? (
                            <>
                                {" "}
                                <Link to={`/products/${prod.id}/edit`}>[Edit]</Link>
                            </>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}
