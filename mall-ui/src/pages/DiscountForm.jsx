import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function DiscountForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        code: "", name: "", percentage: "",
        startsAt: "", endsAt: "", active: true
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            API.get(`/discounts/${id}`)
                .then(res => {
                    const d = res.data;
                    setFormData({
                        code: d.code, name: d.name, percentage: d.percentage,
                        startsAt: d.startsAt ? new Date(d.startsAt).toISOString().slice(0, 16) : "",
                        endsAt:   d.endsAt   ? new Date(d.endsAt).toISOString().slice(0, 16)   : "",
                        active: d.active
                    });
                })
                .catch(() => setMsg("Failed to load discount."));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(""); setLoading(true);
        if (!formData.code.trim() || !formData.percentage) {
            setMsg("Code and percentage are required."); setLoading(false); return;
        }
        const payload = {
            code: formData.code.trim().toUpperCase(),
            name: formData.name.trim() || formData.code.trim().toUpperCase(),
            percentage: parseFloat(formData.percentage),
            startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
            endsAt:   formData.endsAt   ? new Date(formData.endsAt).toISOString()   : null,
            active: formData.active
        };
        try {
            if (isEdit) { await API.put(`/discounts/${id}`, payload); setMsg("Discount updated successfully!"); }
            else        { await API.post("/discounts", payload);       setMsg("Discount created successfully!"); }
            setTimeout(() => navigate("/discounts"), 1500);
        } catch (err) {
            setMsg(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} discount.`);
        }
        setLoading(false);
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all [color-scheme:dark]";

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-amber-500/8 blur-[80px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate("/discounts")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
                >
                    ← Back to Discounts
                </button>

                {/* Title */}
                <div className="mb-10">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
                        {isEdit ? "Editing" : "New"} Discount
                    </p>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        {isEdit ? "Edit Discount" : "Create Discount"}
                    </h1>
                </div>

                {/* Message */}
                {msg && (
                    <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl text-sm font-medium ${
                        msg.includes("successfully")
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    }`}>
                        <span>{msg.includes("successfully") ? "✅" : "⚠️"}</span> {msg}
                    </div>
                )}

                <div className="glass-card">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Code */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                Discount Code <span className="text-rose-400">*</span>
                            </label>
                            <input type="text" name="code" value={formData.code} onChange={handleChange}
                                placeholder="e.g. SUMMER2025" required className={`${inputClass} uppercase`} />
                            <p className="text-slate-600 text-xs mt-1.5">Will be converted to uppercase</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                Display Name <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span>
                            </label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                placeholder="e.g. Summer Sale 2025" className={inputClass} />
                            <p className="text-slate-600 text-xs mt-1.5">Defaults to code if empty</p>
                        </div>

                        {/* Percentage */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                Discount % <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                                <input type="number" name="percentage" value={formData.percentage} onChange={handleChange}
                                    placeholder="20" min="1" max="100" step="0.01" required
                                    className={`${inputClass} pr-10`} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                            </div>
                            <p className="text-slate-600 text-xs mt-1.5">Enter a value between 1 and 100</p>
                        </div>

                        {/* Dates */}
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Start Date</label>
                                <input type="datetime-local" name="startsAt" value={formData.startsAt}
                                    onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">End Date</label>
                                <input type="datetime-local" name="endsAt" value={formData.endsAt}
                                    onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        {/* Active toggle */}
                        <div
                            onClick={() => setFormData(p => ({ ...p, active: !p.active }))}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                formData.active
                                    ? "border-emerald-500/30 bg-emerald-500/5"
                                    : "border-white/10 bg-white/[0.02]"
                            }`}
                        >
                            <div>
                                <p className="text-white font-bold text-sm">Active Status</p>
                                <p className="text-slate-500 text-xs mt-0.5">
                                    {formData.active ? "Discount is live and usable" : "Discount is disabled"}
                                </p>
                            </div>
                            <div className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${
                                formData.active ? "bg-emerald-500" : "bg-white/15"
                            }`}>
                                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all duration-200 ${
                                    formData.active ? "left-[26px]" : "left-0.5"
                                }`} />
                            </div>
                            <input type="checkbox" name="active" checked={formData.active}
                                onChange={handleChange} className="hidden" />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn-primary flex-1 justify-center py-3.5 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        {isEdit ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {isEdit ? "Update Discount" : "Create Discount"}
                                    </>
                                )}
                            </button>
                            <button type="button" onClick={() => navigate("/discounts")} className="btn-ghost px-6 py-3.5">
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}