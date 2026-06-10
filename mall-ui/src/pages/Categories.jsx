import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
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
            .then((res) => { setCategories(res.data); validateCategories(res.data); })
            .catch(() => setMsg("❌ Failed to load categories"))
            .finally(() => setLoading(false));
    }

    useEffect(() => { fetchCategories(); }, []);

    function validateCategory(cat) {
        const errors = [];
        if (!cat.id) errors.push("Invalid category ID");
        if (!cat.name || cat.name.trim().length === 0) errors.push("Name is required");
        if (cat.name && cat.name.trim().length < 2) errors.push("Name must be at least 2 characters");
        if (cat.name && cat.name.trim().length > 100) errors.push("Name must not exceed 100 characters");
        if (cat.name && !/^[a-zA-Z0-9\\s&-]+$/.test(cat.name)) errors.push("Name contains invalid characters");
        if (cat.description && cat.description.trim().length < 5) errors.push("Description must be at least 5 characters");
        if (cat.description && cat.description.trim().length > 100) errors.push("Description must not exceed 100 characters");
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
            if (!value || value.trim().length === 0) error = "Category name is required";
            else if (value.trim().length < 2) error = "Name must be at least 2 characters";
            else if (value.trim().length > 100) error = "Name must not exceed 100 characters";
            else if (!/^[a-zA-Z0-9\\s&-]+$/.test(value)) error = "Only letters, numbers, spaces, &, and - are allowed";
        }
        if (name === "description") {
            if (value && value.trim().length > 0 && value.trim().length < 5) error = "Description must be at least 5 characters";
            else if (value && value.trim().length > 100) error = "Description must not exceed 100 characters";
        }
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        return error === "";
    }

    function validateAllFields() {
        const nameValid = validateField("name", catFields.name);
        const descValid = validateField("description", catFields.description);
        return nameValid && descValid;
    }

    useEffect(() => { if (categories.length > 0) validateCategories(categories); }, [categories]);

    function handleFieldChange(e) {
        const { name, value } = e.target;
        setCatFields({ ...catFields, [name]: value });
        validateField(name, value);
    }

    function handleEdit(cat) {
        const catErr = categoryErrors[cat.id];
        if (catErr) { setMsg(`❌ Cannot edit invalid category: ${catErr}`); setTimeout(() => setMsg(""), 3000); return; }
        setEditCat(cat);
        setCatFields({ name: cat.name, description: cat.description || "" });
        setFieldErrors({ name: "", description: "" });
        setMsg("");
    }

    async function handleSave(e) {
        e.preventDefault();
        if (!validateAllFields()) { setMsg("❌ Please fix validation errors before saving"); setTimeout(() => setMsg(""), 3000); return; }
        if (!catFields.name.trim()) { setMsg("❌ Category name is required"); return; }
        try {
            if (editCat) {
                await API.put(`/categories/${editCat.id}`, { name: catFields.name.trim(), description: catFields.description.trim() });
                setMsg("✓ Category updated successfully!");
            } else {
                await API.post("/categories", { name: catFields.name.trim(), description: catFields.description.trim() });
                setMsg("✓ Category created successfully!");
            }
            setEditCat(null);
            setCatFields({ name: "", description: "" });
            setFieldErrors({ name: "", description: "" });
            fetchCategories();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg(`❌ ${err.response?.data?.message || "Failed to save category"}`);
        }
    }

    async function handleDelete(cat) {
        const catErr = categoryErrors[cat.id];
        if (catErr) { setMsg(`❌ Cannot delete invalid category: ${catErr}`); setTimeout(() => setMsg(""), 3000); return; }
        if (!window.confirm(`Are you sure you want to delete "${cat.name}"?\n\nThis action is permanent and cannot be undone.`)) return;
        try {
            await API.delete(`/categories/${cat.id}`);
            setMsg("✓ Category deleted successfully");
            fetchCategories();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("❌ Failed to delete category. It may have associated products.");
        }
    }

    function handleViewProducts(cat) {
        const catErr = categoryErrors[cat.id];
        if (catErr) { setMsg(`❌ Cannot view products for invalid category: ${catErr}`); setTimeout(() => setMsg(""), 3000); return; }
        navigate(`/products?category=${cat.id}`);
    }

    const inputClass = (hasErr) =>
        `w-full px-4 py-3 rounded-xl border text-white placeholder-slate-500 text-sm outline-none transition-all ${
            hasErr
                ? "border-rose-500/60 bg-rose-500/5 focus:border-rose-400"
                : "border-white/10 bg-white/5 focus:border-amber-400/50 focus:bg-white/8"
        }`;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading categories...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Management</p>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Categories</h1>
                    <p className="text-slate-400 text-sm">Organize your products into categories</p>
                </div>

                {/* Global message */}
                {msg && (
                    <div className={`flex items-center gap-3 p-4 mb-8 rounded-xl text-sm font-medium ${
                        msg.startsWith("✓")
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    }`}>
                        <span>{msg.startsWith("✓") ? "✅" : "⚠️"}</span> {msg}
                    </div>
                )}

                {/* ── Admin Form ── */}
                {role === "ADMIN" && (
                    <div className="glass-card mb-10">
                        <h2 className="text-white text-lg font-black mb-7 flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center text-base">
                                {editCat ? "✏️" : "➕"}
                            </span>
                            {editCat ? "Edit Category" : "Create New Category"}
                        </h2>

                        <form onSubmit={handleSave} className="flex flex-col gap-5">
                            {/* Name */}
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Category Name <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={catFields.name}
                                    onChange={handleFieldChange}
                                    placeholder="e.g. Electronics"
                                    required
                                    className={inputClass(!!fieldErrors.name)}
                                />
                                {fieldErrors.name && (
                                    <p className="text-rose-400 text-xs mt-2 font-semibold">{fieldErrors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Description <span className="text-slate-500 normal-case tracking-normal font-normal">(5–100 characters)</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={catFields.description}
                                    onChange={handleFieldChange}
                                    placeholder="Short description of this category..."
                                    rows={3}
                                    className={`${inputClass(!!fieldErrors.description)} resize-none font-inherit`}
                                />
                                <div className="flex justify-between mt-2">
                                    {fieldErrors.description
                                        ? <p className="text-rose-400 text-xs font-semibold">{fieldErrors.description}</p>
                                        : <span />
                                    }
                                    <span className={`text-xs ${catFields.description.length > 100 ? "text-rose-400" : catFields.description.length > 80 ? "text-amber-400" : "text-slate-600"}`}>
                                        {catFields.description.length} / 100
                                    </span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={!!fieldErrors.name || !!fieldErrors.description}
                                    className={`btn-primary flex-1 justify-center py-3 ${
                                        (fieldErrors.name || fieldErrors.description) ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editCat ? "Update Category" : "Create Category"}
                                </button>
                                {editCat && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditCat(null); setCatFields({ name: "", description: "" }); setFieldErrors({ name: "", description: "" }); }}
                                        className="btn-ghost px-6 py-3"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* ── Categories Grid ── */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                    <h2 className="text-white text-lg font-black mb-7 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-base">🗂️</span>
                        All Categories
                        <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-xs font-bold rounded-full">
                            {categories.length}
                        </span>
                    </h2>

                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">📂</div>
                            <p className="text-white font-bold mb-1">No categories found</p>
                            <p className="text-slate-500 text-sm">
                                {role === "ADMIN" ? "Create your first category above" : "No categories available yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {categories.map((cat) => {
                                const catErr = categoryErrors[cat.id];
                                return (
                                    <div
                                        key={cat.id}
                                        className={`group p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
                                            catErr
                                                ? "border-rose-500/40 bg-rose-500/[0.03]"
                                                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                                        }`}
                                    >
                                        {/* Icon + Name */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                                                📁
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className={`font-black text-base truncate ${catErr ? "text-rose-400" : "text-white"}`}>
                                                    {cat.name}
                                                </h3>
                                                {catErr && (
                                                    <p className="text-rose-400 text-xs mt-1">⚠️ {catErr}</p>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-slate-500 text-xs leading-relaxed mb-5">
                                            {cat.description || "No description provided"}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewProducts(cat)}
                                                disabled={!!catErr}
                                                title={catErr ? "Fix validation errors first" : "View products"}
                                                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                                    catErr
                                                        ? "bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed"
                                                        : "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20"
                                                }`}
                                            >
                                                👁️ View
                                            </button>
                                            {role === "ADMIN" && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                        disabled={!!catErr}
                                                        title={catErr ? "Fix validation errors first" : "Edit category"}
                                                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                                            catErr
                                                                ? "bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed"
                                                                : "bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20"
                                                        }`}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat)}
                                                        disabled={!!catErr}
                                                        title={catErr ? "Fix validation errors first" : "Delete category"}
                                                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                                            catErr
                                                                ? "bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed"
                                                                : "bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20"
                                                        }`}
                                                    >
                                                        🗑️
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}