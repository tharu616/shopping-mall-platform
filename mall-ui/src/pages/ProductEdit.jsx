import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../AuthContext";

export default function ProductEdit() {
    const { id } = useParams();
    const { role } = useAuth();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [fields, setFields] = useState({
        name: "", description: "", price: "", stock: "",
        sku: "", categoryId: "", active: true, imageUrl: ""
    });
    const [msg, setMsg] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            API.get(`/products/${id}`).then(res => {
                setFields(res.data);
                if (res.data.imageUrl) setImagePreview(`http://localhost:8081${res.data.imageUrl}`);
            });
        }
    }, [id, isEdit]);

    function validateProduct() {
        const newErrors = {};
        if (!fields.sku.trim()) newErrors.sku = "SKU is required";
        else if (fields.sku.length < 3) newErrors.sku = "SKU must be at least 3 characters";
        else if (fields.sku.length > 64) newErrors.sku = "SKU cannot exceed 64 characters";
        else if (!/^[A-Z0-9-_]+$/i.test(fields.sku)) newErrors.sku = "SKU can only contain letters, numbers, hyphens, and underscores";
        if (!fields.name.trim()) newErrors.name = "Product name is required";
        else if (fields.name.trim().length < 3) newErrors.name = "Product name must be at least 3 characters";
        else if (fields.name.length > 255) newErrors.name = "Product name cannot exceed 255 characters";
        if (fields.description && fields.description.length > 5000) newErrors.description = "Description cannot exceed 5000 characters";
        if (!fields.price && fields.price !== 0) newErrors.price = "Price is required";
        else { const p = parseFloat(fields.price); if (isNaN(p)) newErrors.price = "Price must be a valid number"; else if (p <= 0) newErrors.price = "Price must be greater than 0"; else if (p > 999999) newErrors.price = "Price cannot exceed 999,999"; }
        if (fields.stock === "" || fields.stock === null) newErrors.stock = "Stock quantity is required";
        else { const s = parseInt(fields.stock); if (isNaN(s)) newErrors.stock = "Stock must be a valid number"; else if (!Number.isInteger(parseFloat(fields.stock))) newErrors.stock = "Stock must be a whole number"; else if (s < 0) newErrors.stock = "Stock cannot be negative"; else if (s > 999999) newErrors.stock = "Stock cannot exceed 999,999"; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) { setMsg("❌ Please select an image file"); return; }
            if (file.size > 5 * 1024 * 1024) { setMsg("❌ Image size must be less than 5MB"); return; }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setMsg("");
        }
    }

    async function uploadImage(productId) {
        if (!selectedFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);
        try {
            const response = await API.post(`/products/${productId}/upload-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
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
        if (!validateProduct()) { setMsg("❌ Please fix the errors before submitting"); return; }
        try {
            let savedProduct;
            if (isEdit) {
                await API.put(`/products/${id}`, fields);
                savedProduct = { id };
                if (selectedFile) await uploadImage(id);
                setMsg("✓ Product updated successfully!");
            } else {
                const response = await API.post("/products", fields);
                savedProduct = response.data;
                if (selectedFile && savedProduct.id) await uploadImage(savedProduct.id);
                setMsg("✓ Product created successfully!");
            }
            setTimeout(() => navigate("/products"), 2000);
        } catch (err) {
            setMsg("❌ Failed to save product");
            console.error(err);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(`Are you sure you want to delete this product?\n\nThis action is permanent and cannot be undone.`);
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
        setFields(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    }

    /* ── Access denied ── */
    if (role !== "VENDOR" && role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
                <div className="glass-card max-w-sm w-full text-center">
                    <div className="text-5xl mb-5">🚫</div>
                    <h2 className="text-white text-xl font-black mb-3">Access Denied</h2>
                    <p className="text-slate-400 text-sm">You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl border ${errors[field]
            ? "border-rose-500/60 bg-rose-500/5"
            : "border-white/10 bg-white/5"
        } text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all`;

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            {/* Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">

                {/* Page title */}
                <div className="mb-10">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
                        {isEdit ? "Inventory · Edit" : "Inventory · New"}
                    </p>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        {isEdit ? "Update your product details below" : "Fill in the details to list a new product"}
                    </p>
                </div>

                {/* Global message */}
                {msg && (
                    <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl text-sm font-medium ${
                        msg.startsWith("✓")
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    }`}>
                        <span className="text-lg">{msg.startsWith("✓") ? "✅" : "⚠️"}</span>
                        {msg}
                    </div>
                )}

                <div className="glass-card">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* SKU + Name */}
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    SKU <span className="text-rose-400">*</span>
                                </label>
                                <input type="text" name="sku" value={fields.sku} onChange={handleFieldChange}
                                    placeholder="e.g. PROD-001" className={inputClass("sku")} />
                                {errors.sku && <p className="text-rose-400 text-xs mt-2">{errors.sku}</p>}
                            </div>
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Product Name <span className="text-rose-400">*</span>
                                </label>
                                <input type="text" name="name" value={fields.name} onChange={handleFieldChange}
                                    placeholder="e.g. Wireless Mouse" className={inputClass("name")} />
                                {errors.name && <p className="text-rose-400 text-xs mt-2">{errors.name}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                name="description"
                                value={fields.description}
                                onChange={handleFieldChange}
                                rows={4}
                                placeholder="Describe your product..."
                                className={`${inputClass("description")} resize-none`}
                            />
                            <div className="flex justify-between mt-2">
                                {errors.description
                                    ? <p className="text-rose-400 text-xs">{errors.description}</p>
                                    : <span />
                                }
                                <span className={`text-xs ${(fields.description?.length || 0) > 4800 ? "text-amber-400" : "text-slate-600"}`}>
                                    {fields.description?.length || 0} / 5000
                                </span>
                            </div>
                        </div>

                        {/* Price + Stock */}
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Price <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                                    <input type="number" name="price" value={fields.price} onChange={handleFieldChange}
                                        step="0.01" min="0.01" placeholder="29.99"
                                        className={`${inputClass("price")} pl-8`} />
                                </div>
                                {errors.price && <p className="text-rose-400 text-xs mt-2">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Stock Quantity <span className="text-rose-400">*</span>
                                </label>
                                <input type="number" name="stock" value={fields.stock} onChange={handleFieldChange}
                                    min="0" step="1" placeholder="100" className={inputClass("stock")} />
                                {errors.stock && <p className="text-rose-400 text-xs mt-2">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
                                Product Image
                            </label>

                            {/* Drop zone */}
                            <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04] transition-all cursor-pointer group">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    🖼️
                                </div>
                                <div className="text-center">
                                    <p className="text-white text-sm font-semibold">Click to upload image</p>
                                    <p className="text-slate-500 text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>

                            {/* Preview */}
                            {imagePreview && (
                                <div className="mt-4 relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-40 h-40 object-cover rounded-2xl border border-white/10"
                                    />
                                    {selectedFile && (
                                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-400 text-black text-xs font-black rounded-full">
                                            New
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Active toggle */}
                        <label className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:border-white/20 transition-colors">
                            <div className="relative flex-shrink-0">
                                <input type="checkbox" name="active" checked={fields.active}
                                    onChange={handleFieldChange} className="sr-only" />
                                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${fields.active ? "bg-amber-400" : "bg-white/10"}`}>
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${fields.active ? "translate-x-5.5 ml-0.5" : "translate-x-0.5"}`} />
                                </div>
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold">Active listing</p>
                                <p className="text-slate-500 text-xs">Visible to customers in the store</p>
                            </div>
                        </label>

                        {/* Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Action buttons */}
                        <div className={`flex gap-3 ${isEdit ? "justify-between" : "justify-end"}`}>
                            {isEdit && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 font-bold text-sm transition-all"
                                >
                                    🗑️ Delete
                                </button>
                            )}

                            <div className="flex gap-3 ml-auto">
                                <button
                                    type="button"
                                    onClick={() => navigate("/products")}
                                    className="btn-ghost px-6 py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className={`btn-primary px-8 py-3 ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            {isEdit ? "Update Product" : "Create Product"}
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Danger Zone */}
                    {isEdit && (
                        <div className="mt-8 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                            <p className="text-rose-400 font-black text-sm flex items-center gap-2 mb-2">
                                <span>⚠️</span> Danger Zone
                            </p>
                            <p className="text-rose-400/70 text-xs leading-relaxed">
                                Once you delete this product, there is no going back. This action cannot be undone.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}