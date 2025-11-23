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

    // ✅ ADD: Field-level errors
    const [errors, setErrors] = useState({});

    // Image upload states
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

    // ✅ ADD: Validation function
    function validateProduct() {
        const newErrors = {};

        // SKU validation
        if (!fields.sku.trim()) {
            newErrors.sku = "SKU is required";
        } else if (fields.sku.length < 3) {
            newErrors.sku = "SKU must be at least 3 characters";
        } else if (fields.sku.length > 64) {
            newErrors.sku = "SKU cannot exceed 64 characters";
        } else if (!/^[A-Z0-9-_]+$/i.test(fields.sku)) {
            newErrors.sku = "SKU can only contain letters, numbers, hyphens, and underscores";
        }

        // Name validation
        if (!fields.name.trim()) {
            newErrors.name = "Product name is required";
        } else if (fields.name.trim().length < 3) {
            newErrors.name = "Product name must be at least 3 characters";
        } else if (fields.name.length > 255) {
            newErrors.name = "Product name cannot exceed 255 characters";
        }

        // Description validation
        if (fields.description && fields.description.length > 5000) {
            newErrors.description = "Description cannot exceed 5000 characters";
        }

        // Price validation
        if (!fields.price && fields.price !== 0) {
            newErrors.price = "Price is required";
        } else {
            const price = parseFloat(fields.price);
            if (isNaN(price)) {
                newErrors.price = "Price must be a valid number";
            } else if (price <= 0) {
                newErrors.price = "Price must be greater than 0";
            } else if (price > 999999) {
                newErrors.price = "Price cannot exceed 999,999";
            }
        }

        // Stock validation
        if (fields.stock === "" || fields.stock === null) {
            newErrors.stock = "Stock quantity is required";
        } else {
            const stock = parseInt(fields.stock);
            if (isNaN(stock)) {
                newErrors.stock = "Stock must be a valid number";
            } else if (!Number.isInteger(parseFloat(fields.stock))) {
                newErrors.stock = "Stock must be a whole number";
            } else if (stock < 0) {
                newErrors.stock = "Stock cannot be negative";
            } else if (stock > 999999) {
                newErrors.stock = "Stock cannot exceed 999,999";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

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
                headers: { 'Content-Type': 'multipart/form-data' }
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

    // ✅ UPDATE: Add validation before submit
    async function handleSubmit(e) {
        e.preventDefault();

        // Validate before submission
        if (!validateProduct()) {
            setMsg("❌ Please fix the errors before submitting");
            return;
        }

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

    // ✅ UPDATE: Clear field error on change
    function handleFieldChange(e) {
        const { name, value, type, checked } = e.target;
        setFields(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    }

    if ((role !== "VENDOR" && role !== "ADMIN")) {
        return (
            <div style={{ padding: 20, textAlign: "center", color: "red" }}>
                You do not have permission to access this page.
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
            <div style={{ background: "white", borderRadius: 12, padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <h2 style={{ marginBottom: "1rem", color: "#1a1a1a" }}>
                    {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
                </h2>
                <p style={{ marginBottom: "2rem", color: "#666", fontSize: 14 }}>
                    {isEdit ? "Update product details" : "Add a new product to your catalog"}
                </p>

                {msg && (
                    <div style={{
                        padding: 16,
                        marginBottom: 20,
                        background: msg.startsWith("✓") ? "#d4edda" : "#f8d7da",
                        border: msg.startsWith("✓") ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
                        borderRadius: 8,
                        color: msg.startsWith("✓") ? "#155724" : "#721c24"
                    }}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* SKU */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
                            SKU <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="sku"
                            value={fields.sku}
                            onChange={handleFieldChange}
                            placeholder="e.g., PROD-001"
                            style={{
                                width: "100%",
                                padding: 12,
                                border: errors.sku ? "1px solid #dc3545" : "1px solid #ddd",
                                borderRadius: 8,
                                fontSize: 14
                            }}
                        />
                        {errors.sku && (
                            <div style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}>
                                {errors.sku}
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
                            Product Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={fields.name}
                            onChange={handleFieldChange}
                            placeholder="e.g., Wireless Mouse"
                            style={{
                                width: "100%",
                                padding: 12,
                                border: errors.name ? "1px solid #dc3545" : "1px solid #ddd",
                                borderRadius: 8,
                                fontSize: 14
                            }}
                        />
                        {errors.name && (
                            <div style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}>
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={fields.description}
                            onChange={handleFieldChange}
                            rows={4}
                            placeholder="Product description..."
                            style={{
                                width: "100%",
                                padding: 12,
                                border: errors.description ? "1px solid #dc3545" : "1px solid #ddd",
                                borderRadius: 8,
                                fontSize: 14,
                                fontFamily: "inherit"
                            }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                            {fields.description?.length || 0} / 5000 characters
                        </div>
                        {errors.description && (
                            <div style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}>
                                {errors.description}
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
                            Price <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={fields.price}
                            onChange={handleFieldChange}
                            step="0.01"
                            min="0.01"
                            placeholder="e.g., 29.99"
                            style={{
                                width: "100%",
                                padding: 12,
                                border: errors.price ? "1px solid #dc3545" : "1px solid #ddd",
                                borderRadius: 8,
                                fontSize: 14
                            }}
                        />
                        {errors.price && (
                            <div style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}>
                                {errors.price}
                            </div>
                        )}
                    </div>

                    {/* Stock */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
                            Stock Quantity <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={fields.stock}
                            onChange={handleFieldChange}
                            min="0"
                            step="1"
                            placeholder="e.g., 100"
                            style={{
                                width: "100%",
                                padding: 12,
                                border: errors.stock ? "1px solid #dc3545" : "1px solid #ddd",
                                borderRadius: 8,
                                fontSize: 14
                            }}
                        />
                        {errors.stock && (
                            <div style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}>
                                {errors.stock}
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
                            Product Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                                width: "100%",
                                padding: 8,
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                fontSize: 14
                            }}
                        />
                        {imagePreview && (
                            <div style={{ marginTop: 12 }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: 200,
                                        maxHeight: 200,
                                        border: "1px solid #ddd",
                                        borderRadius: 8
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Active Checkbox */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                name="active"
                                checked={fields.active}
                                onChange={handleFieldChange}
                                style={{ width: 18, height: 18, cursor: "pointer" }}
                            />
                            <span style={{ color: "#333", fontSize: 14 }}>
                                Active (visible to customers)
                            </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 12, justifyContent: isEdit ? "space-between" : "flex-end" }}>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                style={{
                                    padding: "12px 24px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    fontSize: 14,
                                    fontWeight: 600
                                }}
                            >
                                🗑️ Delete
                            </button>
                        )}

                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                style={{
                                    padding: "12px 24px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    fontSize: 14,
                                    fontWeight: 600
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                style={{
                                    padding: "12px 24px",
                                    backgroundColor: uploading ? "#ccc" : "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: uploading ? "not-allowed" : "pointer",
                                    fontSize: 14,
                                    fontWeight: 600
                                }}
                            >
                                {uploading ? "Uploading..." : isEdit ? "Update Product" : "Create Product"}
                            </button>
                        </div>
                    </div>
                </form>

                {isEdit && (
                    <div style={{
                        marginTop: 32,
                        padding: 16,
                        background: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: 8
                    }}>
                        <strong style={{ color: "#856404" }}>⚠️ Danger Zone</strong>
                        <p style={{ margin: "8px 0 0", color: "#856404", fontSize: 13 }}>
                            Once you delete this product, there is no going back. This action cannot be undone.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
