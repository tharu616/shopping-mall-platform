import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ProductForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        sku: "", name: "", description: "", price: "", stock: "", active: true
    });

    function validateProduct() {
        const newErrors = {};
        if (!form.sku.trim()) newErrors.sku = "SKU is required";
        else if (form.sku.length < 3) newErrors.sku = "SKU must be at least 3 characters";
        else if (form.sku.length > 64) newErrors.sku = "SKU cannot exceed 64 characters";
        else if (!/^[A-Z0-9-_]+$/i.test(form.sku)) newErrors.sku = "SKU can only contain letters, numbers, hyphens, and underscores";
        if (!form.name.trim()) newErrors.name = "Product name is required";
        else if (form.name.trim().length < 3) newErrors.name = "Product name must be at least 3 characters";
        else if (form.name.length > 255) newErrors.name = "Product name cannot exceed 255 characters";
        if (form.description && form.description.length > 5000) newErrors.description = "Description cannot exceed 5000 characters";
        if (!form.price) newErrors.price = "Price is required";
        else { const p = parseFloat(form.price); if (isNaN(p)) newErrors.price = "Price must be a valid number"; else if (p <= 0) newErrors.price = "Price must be greater than 0"; else if (p > 999999) newErrors.price = "Price cannot exceed 999,999"; }
        if (form.stock === "" || form.stock === null) newErrors.stock = "Stock quantity is required";
        else { const s = parseInt(form.stock); if (isNaN(s)) newErrors.stock = "Stock must be a valid number"; else if (!Number.isInteger(parseFloat(form.stock))) newErrors.stock = "Stock must be a whole number"; else if (s < 0) newErrors.stock = "Stock cannot be negative"; else if (s > 999999) newErrors.stock = "Stock cannot exceed 999,999"; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateProduct()) { setError("Please fix the errors before submitting"); return; }
        setLoading(true); setError("");
        try {
            const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
            await API.post("/products", data);
            alert("✓ Product created successfully!");
            navigate("/products");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create product");
        }
        setLoading(false);
    };

    function handleFieldChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    }

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl border ${errors[field] ? "border-rose-500/60 bg-rose-500/5" : "border-white/10 bg-white/5"} text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all`;

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">

                {/* Page title */}
                <div className="mb-10">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Inventory</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">Add New Product</h1>
                    <p className="text-slate-400 text-sm mt-2">Fill in the details below to list a new product</p>
                </div>

                <div className="glass-card">

                    {/* Global error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* SKU + Name side by side */}
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    SKU <span className="text-rose-400">*</span>
                                </label>
                                <input type="text" name="sku" value={form.sku} onChange={handleFieldChange} placeholder="e.g. PROD-001" className={inputClass("sku")} />
                                {errors.sku && <p className="text-rose-400 text-xs mt-2">{errors.sku}</p>}
                            </div>
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Product Name <span className="text-rose-400">*</span>
                                </label>
                                <input type="text" name="name" value={form.name} onChange={handleFieldChange} placeholder="e.g. Wireless Mouse" className={inputClass("name")} />
                                {errors.name && <p className="text-rose-400 text-xs mt-2">{errors.name}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
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
                                <span className={`text-xs ${(form.description?.length || 0) > 4800 ? "text-amber-400" : "text-slate-600"}`}>
                                    {form.description?.length || 0} / 5000
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
                                    <input type="number" name="price" value={form.price} onChange={handleFieldChange} step="0.01" min="0.01" placeholder="29.99" className={`${inputClass("price")} pl-8`} />
                                </div>
                                {errors.price && <p className="text-rose-400 text-xs mt-2">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Stock Quantity <span className="text-rose-400">*</span>
                                </label>
                                <input type="number" name="stock" value={form.stock} onChange={handleFieldChange} min="0" step="1" placeholder="100" className={inputClass("stock")} />
                                {errors.stock && <p className="text-rose-400 text-xs mt-2">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Active toggle */}
                        <label className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:border-white/20 transition-colors group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={form.active}
                                    onChange={handleFieldChange}
                                    className="sr-only"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${form.active ? "bg-amber-400" : "bg-white/10"}`}>
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${form.active ? "translate-x-5.5 ml-0.5" : "translate-x-0.5"}`} />
                                </div>
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold">Active listing</p>
                                <p className="text-slate-500 text-xs">Visible to customers in the store</p>
                            </div>
                        </label>

                        {/* Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Actions */}
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="btn-ghost px-6 py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn-primary px-8 py-3 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        Create Product
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}