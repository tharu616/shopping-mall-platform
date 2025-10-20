import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ProductEdit() {
    const { id } = useParams();
    const { role } = useAuth();
    const navigate = useNavigate();

    const isEdit = !!id;
    const [fields, setFields] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        categoryId: "",
        active: true
    });
    const [msg, setMsg] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    useEffect(() => {
        // Fetch existing product if editing
        if (isEdit) {
            API.get(`/products/${id}`).then(res => setFields(res.data));
        }
    }, [id, isEdit]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (isEdit) {
                await API.put(`/products/${id}`, fields);
                setMsg("✓ Product updated successfully!");
                setTimeout(() => navigate("/products"), 1500);
            } else {
                await API.post("/products", fields);
                setMsg("✓ Product created successfully!");
                setTimeout(() => navigate("/products"), 1500);
            }
        } catch (err) {
            setMsg("❌ Failed to save product");
        }
    }

    async function handleDelete() {
        if (deleteConfirmText !== "DELETE") {
            setMsg("Please type DELETE to confirm");
            return;
        }

        try {
            await API.delete(`/products/${id}`);
            setMsg("✓ Product deleted successfully");
            setTimeout(() => navigate("/products"), 1500);
        } catch (err) {
            setMsg("❌ Failed to delete product");
        }
    }

    function handleFieldChange(e) {
        const { name, value, type, checked } = e.target;
        setFields(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    if ((role !== "VENDOR" && role !== "ADMIN")) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)"
            }}>
                <div style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    padding: "40px",
                    borderRadius: "24px",
                    textAlign: "center",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚫</div>
                    <h2 style={{ fontSize: "24px", color: "#dc3545", marginBottom: "12px" }}>
                        Access Denied
                    </h2>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        You do not have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        {isEdit ? "✏️ Edit Product" : "✨ Create Product"}
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        {isEdit ? "Update product details" : "Add a new product to your catalog"}
                    </p>
                </div>

                {/* Form Card - Glassmorphism */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    marginBottom: "24px"
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Product Name */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                color: "#1A1A2E",
                                marginBottom: "10px",
                                fontSize: "15px"
                            }}>
                                📦 Product Name
                            </label>
                            <input
                                name="name"
                                placeholder="Enter product name"
                                value={fields.name}
                                onChange={handleFieldChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "14px 18px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(30,144,255,0.3)",
                                    background: "rgba(255,255,255,0.9)",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1A1A2E",
                                    outline: "none",
                                    transition: "all 0.3s"
                                }}
                                onFocus={(e) => e.target.style.border = "2px solid #1E90FF"}
                                onBlur={(e) => e.target.style.border = "2px solid rgba(30,144,255,0.3)"}
                            />
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                color: "#1A1A2E",
                                marginBottom: "10px",
                                fontSize: "15px"
                            }}>
                                📝 Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Enter product description"
                                value={fields.description}
                                onChange={handleFieldChange}
                                required
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "14px 18px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(30,144,255,0.3)",
                                    background: "rgba(255,255,255,0.9)",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1A1A2E",
                                    outline: "none",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                    transition: "all 0.3s"
                                }}
                                onFocus={(e) => e.target.style.border = "2px solid #1E90FF"}
                                onBlur={(e) => e.target.style.border = "2px solid rgba(30,144,255,0.3)"}
                            />
                        </div>

                        {/* Price and Stock - Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginBottom: "24px"
                        }}>
                            {/* Price */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    marginBottom: "10px",
                                    fontSize: "15px"
                                }}>
                                    💰 Price ($)
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={fields.price}
                                    onChange={handleFieldChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px",
                                        borderRadius: "12px",
                                        border: "2px solid rgba(30,144,255,0.3)",
                                        background: "rgba(255,255,255,0.9)",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#1A1A2E",
                                        outline: "none",
                                        transition: "all 0.3s"
                                    }}
                                    onFocus={(e) => e.target.style.border = "2px solid #1E90FF"}
                                    onBlur={(e) => e.target.style.border = "2px solid rgba(30,144,255,0.3)"}
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    marginBottom: "10px",
                                    fontSize: "15px"
                                }}>
                                    📊 Stock
                                </label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={fields.stock}
                                    onChange={handleFieldChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px",
                                        borderRadius: "12px",
                                        border: "2px solid rgba(30,144,255,0.3)",
                                        background: "rgba(255,255,255,0.9)",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#1A1A2E",
                                        outline: "none",
                                        transition: "all 0.3s"
                                    }}
                                    onFocus={(e) => e.target.style.border = "2px solid #1E90FF"}
                                    onBlur={(e) => e.target.style.border = "2px solid rgba(30,144,255,0.3)"}
                                />
                            </div>
                        </div>

                        {/* SKU and Category ID - Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginBottom: "24px"
                        }}>
                            {/* SKU */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    marginBottom: "10px",
                                    fontSize: "15px"
                                }}>
                                    🏷️ SKU (Optional)
                                </label>
                                <input
                                    name="sku"
                                    placeholder="Product SKU"
                                    value={fields.sku}
                                    onChange={handleFieldChange}
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px",
                                        borderRadius: "12px",
                                        border: "2px solid rgba(30,144,255,0.3)",
                                        background: "rgba(255,255,255,0.9)",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#1A1A2E",
                                        outline: "none",
                                        transition: "all 0.3s"
                                    }}
                                    onFocus={(e) => e.target.style.border = "2px solid #1E90FF"}
                                    onBlur={(e) => e.target.style.border = "2px solid rgba(30,144,255,0.3)"}
                                />
                            </div>

                            {/* Category ID */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    marginBottom: "10px",
                                    fontSize: "15px"
                                }}>
                                    🗂️ Category ID
                                </label>
                                <input
                                    name="categoryId"
                                    placeholder="Category ID"
                                    value={fields.categoryId}
                                    onChange={handleFieldChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px",
                                        borderRadius: "12px",
                                        border: "2px solid rgba(30,144,255,0.3)",
                                        background: "rgba(255,255,255,0.9)",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#1A1A2E",
                                        outline: "none",
                                        transition: "all 0.3s"
                                    }}
                                    onFocus={(e) => e.target.style.border = "2px solid #1E90FF"}
                                    onBlur={(e) => e.target.style.border = "2px solid rgba(30,144,255,0.3)"}
                                />
                            </div>
                        </div>

                        {/* Active Checkbox */}
                        <div style={{
                            padding: "20px",
                            background: "linear-gradient(135deg, rgba(30,144,255,0.05), rgba(75,54,139,0.05))",
                            borderRadius: "16px",
                            marginBottom: "24px",
                            border: "1px solid rgba(30,144,255,0.1)"
                        }}>
                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                userSelect: "none"
                            }}>
                                <input
                                    name="active"
                                    type="checkbox"
                                    checked={fields.active}
                                    onChange={handleFieldChange}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        marginRight: "12px",
                                        cursor: "pointer",
                                        accentColor: "#1E90FF"
                                    }}
                                />
                                <span style={{
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    fontSize: "15px"
                                }}>
                                    ✅ Product Active (Available for purchase)
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "18px",
                                fontWeight: "700",
                                cursor: "pointer",
                                boxShadow: "0 8px 24px rgba(76,175,80,0.4)",
                                transition: "all 0.3s"
                            }}
                        >
                            {isEdit ? "✓ Update Product" : "✨ Create Product"}
                        </button>

                        {/* Message */}
                        {msg && (
                            <div style={{
                                marginTop: "20px",
                                padding: "16px 20px",
                                borderRadius: "12px",
                                background: msg.includes("✓")
                                    ? "rgba(76,175,80,0.15)"
                                    : "rgba(220,53,69,0.15)",
                                color: msg.includes("✓") ? "#4CAF50" : "#dc3545",
                                fontWeight: "700",
                                fontSize: "15px",
                                border: `2px solid ${msg.includes("✓") ? "#4CAF50" : "#dc3545"}`,
                                textAlign: "center"
                            }}>
                                {msg}
                            </div>
                        )}
                    </form>
                </div>

                {/* Delete Button (Only for Edit mode) */}
                {isEdit && (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "24px",
                        padding: "30px",
                        border: "2px solid rgba(220,53,69,0.3)",
                        boxShadow: "0 8px 32px rgba(220,53,69,0.1)"
                    }}>
                        <h3 style={{
                            fontSize: "20px",
                            fontWeight: "800",
                            color: "#dc3545",
                            marginBottom: "12px"
                        }}>
                            ⚠️ Danger Zone
                        </h3>
                        <p style={{
                            color: "#666",
                            fontSize: "14px",
                            marginBottom: "20px",
                            lineHeight: "1.6"
                        }}>
                            Once you delete this product, there is no going back. This action cannot be undone.
                        </p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            style={{
                                padding: "14px 24px",
                                background: "linear-gradient(135deg, #dc3545, #c82333)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(220,53,69,0.3)"
                            }}
                        >
                            🗑️ Delete Product
                        </button>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "20px"
                    }}>
                        <div style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "24px",
                            padding: "40px",
                            maxWidth: "500px",
                            width: "100%",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                            border: "2px solid rgba(220,53,69,0.3)"
                        }}>
                            <div style={{
                                fontSize: "64px",
                                textAlign: "center",
                                marginBottom: "20px"
                            }}>
                                ⚠️
                            </div>

                            <h2 style={{
                                fontSize: "28px",
                                fontWeight: "800",
                                color: "#dc3545",
                                textAlign: "center",
                                marginBottom: "16px"
                            }}>
                                Delete Product?
                            </h2>

                            <p style={{
                                color: "#666",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                marginBottom: "24px",
                                textAlign: "center"
                            }}>
                                This action is <strong>permanent</strong> and cannot be undone. The product will be removed from your catalog.
                            </p>

                            <div style={{
                                padding: "16px",
                                background: "rgba(220,53,69,0.1)",
                                borderRadius: "12px",
                                marginBottom: "24px",
                                border: "1px solid rgba(220,53,69,0.2)"
                            }}>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    marginBottom: "12px",
                                    fontWeight: "600"
                                }}>
                                    Type <strong style={{ color: "#dc3545" }}>DELETE</strong> to confirm:
                                </p>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Type DELETE here"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "2px solid rgba(220,53,69,0.3)",
                                        background: "rgba(255,255,255,0.9)",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        outline: "none",
                                        textTransform: "uppercase"
                                    }}
                                />
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "12px"
                            }}>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText("");
                                    }}
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
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteConfirmText !== "DELETE"}
                                    style={{
                                        flex: 1,
                                        padding: "14px",
                                        background: deleteConfirmText === "DELETE"
                                            ? "linear-gradient(135deg, #dc3545, #c82333)"
                                            : "#ccc",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        cursor: deleteConfirmText === "DELETE" ? "pointer" : "not-allowed",
                                        boxShadow: deleteConfirmText === "DELETE"
                                            ? "0 4px 15px rgba(220,53,69,0.4)"
                                            : "none"
                                    }}
                                >
                                    🗑️ Delete Forever
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
