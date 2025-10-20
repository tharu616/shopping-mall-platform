import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function ProductForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        sku: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        active: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock)
            };

            await API.post("/products", data);
            alert("✓ Product created successfully!");
            navigate("/products");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create product");
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{
                    fontSize: "36px",
                    fontWeight: "800",
                    color: "#1A1A2E",
                    marginBottom: "30px",
                    textAlign: "center"
                }}>
                    ➕ Create New Product
                </h1>

                <div style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                marginBottom: "8px",
                                color: "#1A1A2E"
                            }}>SKU</label>
                            <input
                                type="text"
                                value={form.sku}
                                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "2px solid #e8ebf0",
                                    fontSize: "15px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                marginBottom: "8px",
                                color: "#1A1A2E"
                            }}>Product Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "2px solid #e8ebf0",
                                    fontSize: "15px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                marginBottom: "8px",
                                color: "#1A1A2E"
                            }}>Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "2px solid #e8ebf0",
                                    fontSize: "15px",
                                    resize: "vertical"
                                }}
                            />
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginBottom: "20px"
                        }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    marginBottom: "8px",
                                    color: "#1A1A2E"
                                }}>Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "2px solid #e8ebf0",
                                        fontSize: "15px"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    marginBottom: "8px",
                                    color: "#1A1A2E"
                                }}>Stock</label>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "2px solid #e8ebf0",
                                        fontSize: "15px"
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                cursor: "pointer"
                            }}>
                                <input
                                    type="checkbox"
                                    checked={form.active}
                                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer"
                                    }}
                                />
                                <span style={{ fontWeight: "600", color: "#1A1A2E" }}>
                                    Active
                                </span>
                            </label>
                        </div>

                        {error && (
                            <div style={{
                                padding: "12px",
                                background: "rgba(220,53,69,0.1)",
                                color: "#dc3545",
                                borderRadius: "10px",
                                marginBottom: "20px",
                                fontWeight: "600"
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{
                            display: "flex",
                            gap: "12px"
                        }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: "14px",
                                    background: loading ? "#ccc" : "linear-gradient(135deg, #4CAF50, #45a049)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    cursor: loading ? "not-allowed" : "pointer"
                                }}
                            >
                                {loading ? "Creating..." : "Create Product"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                style={{
                                    flex: 1,
                                    padding: "14px",
                                    background: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
