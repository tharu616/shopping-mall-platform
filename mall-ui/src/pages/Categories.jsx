import { useState, useEffect } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();
    const [editCat, setEditCat] = useState(null);
    const [msg, setMsg] = useState("");
    const [catFields, setCatFields] = useState({ name: "", description: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    function fetchCategories() {
        setLoading(true);
        API.get("/categories")
            .then(res => setCategories(res.data))
            .finally(() => setLoading(false));
    }

    useEffect(() => { fetchCategories(); }, []);

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
        } catch {
            setMsg("❌ Failed to save category");
        }
    }

    function openDeleteModal(cat) {
        setDeleteTarget(cat);
        setShowDeleteModal(true);
        setDeleteConfirmText("");
    }

    async function handleDelete() {
        if (deleteConfirmText !== "DELETE") {
            setMsg("Please type DELETE to confirm");
            return;
        }

        try {
            await API.delete(`/categories/${deleteTarget.id}`);
            setMsg("✓ Category deleted successfully");
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteConfirmText("");
            fetchCategories();
            setTimeout(() => setMsg(""), 3000);
        } catch {
            setMsg("❌ Failed to delete category");
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        🗂️ Categories
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        Organize your products into categories
                    </p>
                </div>

                {/* Create/Edit Form - ADMIN Only */}
                {role === "ADMIN" && (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "24px",
                        padding: "40px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        marginBottom: "30px"
                    }}>
                        <h3 style={{
                            fontSize: "20px",
                            fontWeight: "800",
                            color: "#1A1A2E",
                            marginBottom: "24px"
                        }}>
                            {editCat ? "✏️ Edit Category" : "➕ Create New Category"}
                        </h3>

                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    marginBottom: "10px",
                                    fontSize: "15px"
                                }}>
                                    📝 Category Name
                                </label>
                                <input
                                    name="name"
                                    placeholder="Enter category name"
                                    value={catFields.name}
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

                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    display: "block",
                                    fontWeight: "700",
                                    color: "#1A1A2E",
                                    marginBottom: "10px",
                                    fontSize: "15px"
                                }}>
                                    📄 Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Enter category description"
                                    value={catFields.description}
                                    onChange={handleFieldChange}
                                    required
                                    rows="3"
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

                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: editCat ? 1 : "auto",
                                        padding: "14px 24px",
                                        background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 15px rgba(76,175,80,0.4)"
                                    }}
                                >
                                    {editCat ? "✓ Update Category" : "➕ Create Category"}
                                </button>

                                {editCat && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditCat(null);
                                            setCatFields({ name: "", description: "" });
                                            setMsg("");
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: "14px 24px",
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
                                )}
                            </div>

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
                )}

                {/* Categories List */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}>
                    <h3 style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "24px"
                    }}>
                        📋 All Categories
                    </h3>

                    {loading ? (
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#666",
                            fontSize: "16px"
                        }}>
                            ⏳ Loading categories...
                        </div>
                    ) : categories.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            color: "#666"
                        }}>
                            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📂</div>
                            <p style={{ fontSize: "18px", fontWeight: "600" }}>No categories found</p>
                            <p style={{ fontSize: "14px", marginTop: "8px" }}>
                                {role === "ADMIN" ? "Create your first category above" : "No categories available"}
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gap: "16px"
                        }}>
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    style={{
                                        padding: "20px 24px",
                                        background: "linear-gradient(135deg, rgba(30,144,255,0.05), rgba(75,54,139,0.05))",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(30,144,255,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        transition: "all 0.3s"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(30,144,255,0.15)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{
                                            fontSize: "18px",
                                            fontWeight: "800",
                                            color: "#1A1A2E",
                                            marginBottom: "6px"
                                        }}>
                                            {cat.name}
                                        </h4>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#666",
                                            lineHeight: "1.5"
                                        }}>
                                            {cat.description}
                                        </p>
                                    </div>

                                    {role === "ADMIN" && (
                                        <div style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginLeft: "20px"
                                        }}>
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                style={{
                                                    padding: "10px 16px",
                                                    background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "10px",
                                                    fontSize: "14px",
                                                    fontWeight: "700",
                                                    cursor: "pointer",
                                                    whiteSpace: "nowrap"
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(cat)}
                                                style={{
                                                    padding: "10px 16px",
                                                    background: "linear-gradient(135deg, #dc3545, #c82333)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "10px",
                                                    fontSize: "14px",
                                                    fontWeight: "700",
                                                    cursor: "pointer",
                                                    whiteSpace: "nowrap"
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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
                                Delete Category?
                            </h2>

                            <p style={{
                                color: "#666",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                marginBottom: "12px",
                                textAlign: "center"
                            }}>
                                Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>?
                            </p>

                            <p style={{
                                color: "#666",
                                fontSize: "14px",
                                lineHeight: "1.6",
                                marginBottom: "24px",
                                textAlign: "center"
                            }}>
                                This action is <strong>permanent</strong> and cannot be undone.
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
                                        setDeleteTarget(null);
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
