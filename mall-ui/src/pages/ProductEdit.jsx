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
        active: true,
        imageUrl: ""
    });
    const [msg, setMsg] = useState("");

    // ✨ Image upload states
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            API.get(`/products/${id}`)
                .then(res => {
                    setFields(res.data);
                    if (res.data.imageUrl) {
                        setImagePreview(`http://localhost:8081${res.data.imageUrl}`);
                    }
                });
        }
    }, [id, isEdit]);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMsg("❌ Please select an image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setMsg("❌ Image size must be less than 5MB");
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setMsg("");
        }
    }

    async function uploadImage(productId) {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await API.post(`/products/${productId}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFields(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
            setImagePreview(`http://localhost:8081${response.data.imageUrl}`);
            setMsg("✓ Image uploaded successfully!");
            setSelectedFile(null);

        } catch (error) {
            setMsg("❌ Failed to upload image");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let savedProduct;
            if (isEdit) {
                await API.put(`/products/${id}`, fields);
                savedProduct = { id };

                if (selectedFile) {
                    await uploadImage(id);
                }

                setMsg("✓ Product updated successfully!");
            } else {
                const response = await API.post("/products", fields);
                savedProduct = response.data;

                if (selectedFile && savedProduct.id) {
                    await uploadImage(savedProduct.id);
                }

                setMsg("✓ Product created successfully!");
            }

            setTimeout(() => navigate("/products"), 2000);

        } catch (err) {
            setMsg("❌ Failed to save product");
            console.error(err);
        }
    }

    // ✅ UPDATED: Simple browser confirmation
    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete this product?\n\nThis action is permanent and cannot be undone.`
        );

        if (!confirmed) return;

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

                {/* Form Card */}
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
                        {/* Product Image Upload Section */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                color: "#1A1A2E",
                                marginBottom: "10px",
                                fontSize: "15px"
                            }}>
                                📸 Product Image
                            </label>

                            {imagePreview && (
                                <div style={{
                                    marginBottom: "16px",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        style={{
                                            maxWidth: "300px",
                                            maxHeight: "300px",
                                            borderRadius: "16px",
                                            objectFit: "cover",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                                        }}
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
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
                                    cursor: "pointer"
                                }}
                            />
                            <p style={{
                                fontSize: "13px",
                                color: "#666",
                                marginTop: "8px"
                            }}>
                                Supported formats: JPG, PNG, GIF (Max 5MB)
                            </p>
                        </div>

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

                        {/* Price and Stock */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginBottom: "24px"
                        }}>
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

                        {/* SKU and Category ID */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginBottom: "24px"
                        }}>
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
                            disabled={uploading}
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: uploading
                                    ? "#ccc"
                                    : "linear-gradient(135deg, #4CAF50, #45a049)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "18px",
                                fontWeight: "700",
                                cursor: uploading ? "not-allowed" : "pointer",
                                boxShadow: uploading
                                    ? "none"
                                    : "0 8px 24px rgba(76,175,80,0.4)",
                                transition: "all 0.3s"
                            }}
                        >
                            {uploading
                                ? "⏳ Uploading..."
                                : isEdit ? "✓ Update Product" : "✨ Create Product"}
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

                {/* Delete Button */}
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
                            onClick={handleDelete}
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
            </div>
        </div>
    );
}
