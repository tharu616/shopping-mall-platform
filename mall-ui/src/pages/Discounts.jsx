import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDiscounts();
    }, []);

    function fetchDiscounts() {
        API.get("/discounts")
            .then(res => setDiscounts(res.data))
            .catch(() => setError("Failed to load discounts."))
            .finally(() => setLoading(false));
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this discount?")) return;

        try {
            await API.delete(`/discounts/${id}`);
            setDiscounts(discounts.filter(d => d.id !== id));
        } catch (err) {
            alert("Failed to delete discount.");
        }
    };

    const toggleActive = async (discount) => {
        try {
            const updated = await API.put(`/discounts/${discount.id}`, {
                ...discount,
                active: !discount.active
            });
            setDiscounts(discounts.map(d => d.id === discount.id ? updated.data : d));
        } catch (err) {
            alert("Failed to update discount status.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Discount Codes</h2>
                <Link to="/discounts/create">
                    <button style={{
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}>
                        + Create New Discount
                    </button>
                </Link>
            </div>

            {discounts.length === 0 ? (
                <p>No discounts found. Create one to get started!</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Code</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Discount %</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Valid Period</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {discounts.map(discount => (
                        <tr key={discount.id} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "12px" }}>
                                <b style={{ color: "#007bff" }}>{discount.code}</b>
                            </td>
                            <td style={{ padding: "12px" }}>{discount.name}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                                    <span style={{
                                        padding: "4px 10px",
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        borderRadius: "12px",
                                        fontWeight: "bold"
                                    }}>
                                        {discount.percentage}%
                                    </span>
                            </td>
                            <td style={{ padding: "12px", textAlign: "center", fontSize: "14px" }}>
                                {discount.startsAt && discount.endsAt ? (
                                    <>
                                        {new Date(discount.startsAt).toLocaleDateString()} - {new Date(discount.endsAt).toLocaleDateString()}
                                    </>
                                ) : (
                                    <span style={{ color: "#666" }}>No expiry</span>
                                )}
                            </td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                                <button
                                    onClick={() => toggleActive(discount)}
                                    style={{
                                        padding: "4px 12px",
                                        backgroundColor: discount.active ? "#28a745" : "#6c757d",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {discount.active ? "ACTIVE" : "INACTIVE"}
                                </button>
                            </td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                    <Link to={`/discounts/edit/${discount.id}`}>
                                        <button style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}>
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(discount.id)}
                                        style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
