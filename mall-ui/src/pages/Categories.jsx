import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Categories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();
    const [editCat, setEditCat] = useState(null);
    const [msg, setMsg] = useState("");
    const [catFields, setCatFields] = useState({ name: "", description: "" });
    const [categoryErrors, setCategoryErrors] = useState({});
    const [fieldErrors, setFieldErrors] = useState({ name: "", description: "" });

    function fetchCategories() {
        setLoading(true);
        API.get("/categories")
            .then((res) => {
                setCategories(res.data);
                validateCategories(res.data);
            })
            .catch(() => setMsg("❌ Failed to load categories"))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    // ===== VALIDATION FUNCTIONS =====
    function validateCategory(cat) {
        const errors = [];

        if (!cat.id) errors.push("Invalid category ID");
        if (!cat.name || cat.name.trim().length === 0) errors.push("Name is required");
        if (cat.name && cat.name.trim().length < 2) errors.push("Name must be at least 2 characters");
        if (cat.name && cat.name.trim().length > 100) errors.push("Name must not exceed 100 characters");
        if (cat.name && !/^[a-zA-Z0-9\s&-]+$/.test(cat.name)) errors.push("Name contains invalid characters");
        if (cat.description && cat.description.trim().length > 500) errors.push("Description too long (max 500 chars)");

        return errors.length > 0 ? errors.join(", ") : "";
    }

    function validateCategories(categoriesList) {
        const errors = {};
        for (const cat of categoriesList || []) {
            const err = validateCategory(cat);
            if (err) errors[cat.id] = err;
        }
        setCategoryErrors(errors);
    }

    function validateField(name, value) {
        let error = "";

        if (name === "name") {
            if (!value || value.trim().length === 0) {
                error = "Category name is required";
            } else if (value.trim().length < 2) {
                error = "Name must be at least 2 characters";
            } else if (value.trim().length > 100) {
                error = "Name must not exceed 100 characters";
            } else if (!/^[a-zA-Z0-9\s&-]+$/.test(value)) {
                error = "Only letters, numbers, spaces, &, and - are allowed";
            }
        }

        if (name === "description") {
            if (value && value.trim().length > 500) {
                error = "Description must not exceed 500 characters";
            }
        }

        setFieldErrors(prev => ({ ...prev, [name]: error }));
        return error === "";
    }

    function validateAllFields() {
        const nameValid = validateField("name", catFields.name);
        const descValid = validateField("description", catFields.description);
        return nameValid && descValid;
    }

    // Revalidate when categories change
    useEffect(() => {
        if (categories.length > 0) {
            validateCategories(categories);
        }
    }, [categories]);

    function handleFieldChange(e) {
        const { name, value } = e.target;
        setCatFields({ ...catFields, [name]: value });
        validateField(name, value);
    }

    function handleEdit(cat) {
        const catErr = categoryErrors[cat.id];
        if (catErr) {
            setMsg(`❌ Cannot edit invalid category: ${catErr}`);
            setTimeout(() => setMsg(""), 3000);
            return;
        }

        setEditCat(cat);
        setCatFields({ name: cat.name, description: cat.description || "" });
        setFieldErrors({ name: "", description: "" });
        setMsg("");
    }

    async function handleSave(e) {
        e.preventDefault();

        // Run full validation
        if (!validateAllFields()) {
            setMsg("❌ Please fix validation errors before saving");
            setTimeout(() => setMsg(""), 3000);
            return;
        }

        if (!catFields.name.trim()) {
            setMsg("❌ Category name is required");
            return;
        }

        try {
            if (editCat) {
                await API.put(`/categories/${editCat.id}`, {
                    name: catFields.name.trim(),
                    description: catFields.description.trim()
                });
                setMsg("✓ Category updated successfully!");
            } else {
                await API.post("/categories", {
                    name: catFields.name.trim(),
                    description: catFields.description.trim()
                });
                setMsg("✓ Category created successfully!");
            }
            setEditCat(null);
            setCatFields({ name: "", description: "" });
            setFieldErrors({ name: "", description: "" });
            fetchCategories();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to save category";
            setMsg(`❌ ${errorMsg}`);
            console.error(err);
        }
    }

    async function handleDelete(cat) {
        const catErr = categoryErrors[cat.id];
        if (catErr) {
            setMsg(`❌ Cannot delete invalid category: ${catErr}`);
            setTimeout(() => setMsg(""), 3000);
            return;
        }

        // ✅ Simple browser confirmation
        const confirmed = window.confirm(
            `Are you sure you want to delete "${cat.name}"?\n\nThis action is permanent and cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await API.delete(`/categories/${cat.id}`);
            setMsg("✓ Category deleted successfully");
            fetchCategories();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("❌ Failed to delete category. It may have associated products.");
            console.error(err);
        }
    }

    function handleViewProducts(cat) {
        const catErr = categoryErrors[cat.id];
        if (catErr) {
            setMsg(`❌ Cannot view products for invalid category: ${catErr}`);
            setTimeout(() => setMsg(""), 3000);
            return;
        }
        navigate(`/products?category=${cat.id}`);
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px", fontSize: "20px", color: "#7f8c8d" }}>
                ⏳ Loading categories...
            </div>
        );
    }

    return (
        <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", background: "#ecf0f1", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "42px", color: "#2c3e50", marginBottom: "10px" }}>
                    📂 Categories
                </h1>
                <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
                    Organize your products into categories
                </p>
            </div>

            {/* Success/Error Message */}
            {msg && (
                <div
                    style={{
                        padding: "15px",
                        marginBottom: "25px",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                        background: msg.startsWith("✓") ? "#d4edda" : "#f8d7da",
                        color: msg.startsWith("✓") ? "#155724" : "#721c24",
                        border: `1px solid ${msg.startsWith("✓") ? "#c3e6cb" : "#f5c6cb"}`,
                    }}
                >
                    {msg}
                </div>
            )}

            {/* Create/Edit Category Form - Admin Only */}
            {role === "ADMIN" && (
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        marginBottom: "40px",
                    }}
                >
                    <h2 style={{ fontSize: "24px", color: "#34495e", marginBottom: "20px" }}>
                        ➕ {editCat ? "Edit Category" : "Create New Category"}
                    </h2>
                    <form onSubmit={handleSave}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555", fontWeight: "bold" }}>
                                📝 Category Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={catFields.name}
                                onChange={handleFieldChange}
                                placeholder="Enter category name"
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    fontSize: "14px",
                                    border: fieldErrors.name ? "2px solid #dc3545" : "1px solid #ddd",
                                    borderRadius: "6px",
                                    boxSizing: "border-box",
                                    background: fieldErrors.name ? "rgba(220,53,69,0.05)" : "white"
                                }}
                            />
                            {fieldErrors.name && (
                                <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                                    {fieldErrors.name}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555", fontWeight: "bold" }}>
                                📄 Description
                            </label>
                            <textarea
                                name="description"
                                value={catFields.description}
                                onChange={handleFieldChange}
                                placeholder="Enter category description"
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    fontSize: "14px",
                                    border: fieldErrors.description ? "2px solid #dc3545" : "1px solid #ddd",
                                    borderRadius: "6px",
                                    resize: "vertical",
                                    boxSizing: "border-box",
                                    background: fieldErrors.description ? "rgba(220,53,69,0.05)" : "white"
                                }}
                            />
                            {fieldErrors.description && (
                                <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                                    {fieldErrors.description}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!!fieldErrors.name || !!fieldErrors.description}
                            style={{
                                background: (fieldErrors.name || fieldErrors.description)
                                    ? "#ccc"
                                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                padding: "14px 28px",
                                fontSize: "16px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: (fieldErrors.name || fieldErrors.description) ? "not-allowed" : "pointer",
                                fontWeight: "bold",
                                width: "100%",
                                transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) => {
                                if (!fieldErrors.name && !fieldErrors.description) {
                                    e.target.style.transform = "scale(1.02)";
                                }
                            }}
                            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                        >
                            ✨ {editCat ? "Update Category" : "Create Category"}
                        </button>

                        {editCat && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditCat(null);
                                    setCatFields({ name: "", description: "" });
                                    setFieldErrors({ name: "", description: "" });
                                }}
                                style={{
                                    background: "#95a5a6",
                                    color: "white",
                                    padding: "14px 28px",
                                    fontSize: "16px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            )}

            {/* All Categories List */}
            <div
                style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ fontSize: "24px", color: "#34495e", marginBottom: "20px" }}>
                    📋 All Categories
                </h2>

                {categories.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "50px", color: "#7f8c8d" }}>
                        <div style={{ fontSize: "48px", marginBottom: "15px" }}>📂</div>
                        <p style={{ fontSize: "18px", marginBottom: "10px" }}>No categories found</p>
                        <p style={{ fontSize: "14px" }}>
                            {role === "ADMIN" ? "Create your first category above" : "No categories available"}
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {categories.map((cat) => {
                            const catErr = categoryErrors[cat.id];

                            return (
                                <div
                                    key={cat.id}
                                    style={{
                                        background: catErr ? "rgba(220,53,69,0.05)" : "#f8f9fa",
                                        padding: "20px",
                                        borderRadius: "10px",
                                        border: catErr ? "2px solid #dc3545" : "1px solid #e0e0e0",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        if (!catErr) {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <h3 style={{ fontSize: "20px", color: catErr ? "#dc3545" : "#2c3e50", marginBottom: "10px" }}>
                                        {cat.name}
                                    </h3>

                                    {catErr && (
                                        <div style={{
                                            color: "#dc3545",
                                            fontSize: "12px",
                                            marginBottom: "10px",
                                            padding: "8px",
                                            background: "rgba(220,53,69,0.1)",
                                            borderRadius: "4px"
                                        }}>
                                            ⚠️ {catErr}
                                        </div>
                                    )}

                                    <p style={{ fontSize: "14px", color: "#7f8c8d", marginBottom: "20px", lineHeight: "1.6" }}>
                                        {cat.description || "No description provided"}
                                    </p>

                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {/* View Products Button */}
                                        <button
                                            onClick={() => handleViewProducts(cat)}
                                            disabled={!!catErr}
                                            style={{
                                                background: catErr ? "#ccc" : "#17a2b8",
                                                color: "white",
                                                padding: "8px 16px",
                                                fontSize: "14px",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: catErr ? "not-allowed" : "pointer",
                                                fontWeight: "bold",
                                                flex: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "5px",
                                            }}
                                            title={catErr ? "Fix validation errors first" : "View products"}
                                        >
                                            👁️ View
                                        </button>

                                        {/* Edit Button - Admin Only */}
                                        {role === "ADMIN" && (
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                disabled={!!catErr}
                                                style={{
                                                    background: catErr ? "#ccc" : "#3498db",
                                                    color: "white",
                                                    padding: "8px 16px",
                                                    fontSize: "14px",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: catErr ? "not-allowed" : "pointer",
                                                    fontWeight: "bold",
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "5px",
                                                }}
                                                title={catErr ? "Fix validation errors first" : "Edit category"}
                                            >
                                                ✏️ Edit
                                            </button>
                                        )}

                                        {/* Delete Button - Admin Only */}
                                        {role === "ADMIN" && (
                                            <button
                                                onClick={() => handleDelete(cat)}
                                                disabled={!!catErr}
                                                style={{
                                                    background: catErr ? "#ccc" : "#e74c3c",
                                                    color: "white",
                                                    padding: "8px 16px",
                                                    fontSize: "14px",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: catErr ? "not-allowed" : "pointer",
                                                    fontWeight: "bold",
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "5px",
                                                }}
                                                title={catErr ? "Fix validation errors first" : "Delete category"}
                                            >
                                                🗑️ Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
