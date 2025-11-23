import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function ProductForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ ADD: Field-level errors
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        sku: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        active: true
    });

    // ✅ ADD: Validation function
    function validateProduct() {
        const newErrors = {};

        // SKU validation
        if (!form.sku.trim()) {
            newErrors.sku = "SKU is required";
        } else if (form.sku.length < 3) {
            newErrors.sku = "SKU must be at least 3 characters";
        } else if (form.sku.length > 64) {
            newErrors.sku = "SKU cannot exceed 64 characters";
        } else if (!/^[A-Z0-9-_]+$/i.test(form.sku)) {
            newErrors.sku = "SKU can only contain letters, numbers, hyphens, and underscores";
        }

        // Name validation
        if (!form.name.trim()) {
            newErrors.name = "Product name is required";
        } else if (form.name.trim().length < 3) {
            newErrors.name = "Product name must be at least 3 characters";
        } else if (form.name.length > 255) {
            newErrors.name = "Product name cannot exceed 255 characters";
        }

        // Description validation
        if (form.description && form.description.length > 5000) {
            newErrors.description = "Description cannot exceed 5000 characters";
        }

        // Price validation
        if (!form.price) {
            newErrors.price = "Price is required";
        } else {
            const price = parseFloat(form.price);
            if (isNaN(price)) {
                newErrors.price = "Price must be a valid number";
            } else if (price <= 0) {
                newErrors.price = "Price must be greater than 0";
            } else if (price > 999999) {
                newErrors.price = "Price cannot exceed 999,999";
            }
        }

        // Stock validation
        if (form.stock === "" || form.stock === null) {
            newErrors.stock = "Stock quantity is required";
        } else {
            const stock = parseInt(form.stock);
            if (isNaN(stock)) {
                newErrors.stock = "Stock must be a valid number";
            } else if (!Number.isInteger(parseFloat(form.stock))) {
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

    // ✅ UPDATE: Add validation before submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate before submission
        if (!validateProduct()) {
            setError("Please fix the errors before submitting");
            return;
        }

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

    // ✅ ADD: Clear field error on change
    function handleFieldChange(e) {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setForm(prev => ({ ...prev, [name]: newValue }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    }

    return (
        <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
            <div style={{ background: "white", borderRadius: 12, padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <h2 style={{ marginBottom: "1.5rem", color: "#1a1a1a" }}>➕ Add New Product</h2>

                {error && (
                    <div style={{ padding: 16, marginBottom: 20, background: "#fee", border: "1px solid #fcc", borderRadius: 8, color: "#c33" }}>
                        {error}
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
                            value={form.sku}
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
                            value={form.name}
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
                            value={form.description}
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
                            {form.description?.length || 0} / 5000 characters
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
                            value={form.price}
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
                            value={form.stock}
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

                    {/* Active */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={handleFieldChange}
                                style={{ width: 18, height: 18, cursor: "pointer" }}
                            />
                            <span style={{ color: "#333", fontSize: 14 }}>
                                Active (visible to customers)
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
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
                            disabled={loading}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: loading ? "#ccc" : "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontSize: 14,
                                fontWeight: 600
                            }}
                        >
                            {loading ? "Creating..." : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
