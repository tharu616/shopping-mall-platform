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

    function fetchCategories() {
        setLoading(true);
        API.get("/categories")
            .then((res) => setCategories(res.data))
            .catch(() => setMsg("❌ Failed to load categories"))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    function handleFieldChange(e) {
        setCatFields({ ...catFields, [e.target.name]: e.target.value });
    }

    function handleEdit(cat) {
        setEditCat(cat);
        setCatFields({ name: cat.name, description: cat.description });
        setMsg("");
    }

    async function handleSave(e) {
        e.preventDefault();
        if (!catFields.name.trim()) {
            setMsg("❌ Category name is required");
            return;
        }

        try {
            if (editCat) {
                await API.put(`/categories/${editCat.id}`, catFields);
                setMsg("✓ Category updated successfully!");
            } else {
                await API.post("/categories", catFields);
                setMsg("✓ Category created successfully!");
            }
            setEditCat(null);
            setCatFields({ name: "", description: "" });
            fetchCategories();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("❌ Failed to save category");
            console.error(err);
        }
    }

    async function handleDelete(cat) {
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

    function handleViewProducts(categoryId) {
        navigate(`/products?category=${categoryId}`);
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
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    boxSizing: "border-box",
                                }}
                            />
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
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    resize: "vertical",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                padding: "14px 28px",
                                fontSize: "16px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                width: "100%",
                                transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) => (e.target.style.transform = "scale(1.02)")}
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
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                style={{
                                    background: "#f8f9fa",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    border: "1px solid #e0e0e0",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "translateY(-5px)";
                                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <h3 style={{ fontSize: "20px", color: "#2c3e50", marginBottom: "10px" }}>
                                    {cat.name}
                                </h3>
                                <p style={{ fontSize: "14px", color: "#7f8c8d", marginBottom: "20px", lineHeight: "1.6" }}>
                                    {cat.description || "No description provided"}
                                </p>

                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {/* View Products Button */}
                                    <button
                                        onClick={() => handleViewProducts(cat.id)}
                                        style={{
                                            background: "#17a2b8",
                                            color: "white",
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "5px",
                                        }}
                                    >
                                        👁️ View
                                    </button>

                                    {/* Edit Button - Admin Only */}
                                    {role === "ADMIN" && (
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            style={{
                                                background: "#3498db",
                                                color: "white",
                                                padding: "8px 16px",
                                                fontSize: "14px",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                flex: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                    )}

                                    {/* Delete Button - Admin Only */}
                                    {role === "ADMIN" && (
                                        <button
                                            onClick={() => handleDelete(cat)}
                                            style={{
                                                background: "#e74c3c",
                                                color: "white",
                                                padding: "8px 16px",
                                                fontSize: "14px",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                flex: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
