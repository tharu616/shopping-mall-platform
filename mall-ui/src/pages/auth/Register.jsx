import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            await API.post("/auth/register", form);
            setMessage("✓ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a1a] px-4 py-16">

            {/* Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px] animate-floatSlow pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-5%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[100px] animate-floatSlow pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">

                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                <div className="glass-card">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-violet-500/30">
                            ✨
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Create Account</h1>
                        <p className="text-slate-400 text-sm">Join us and start shopping today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Name */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Name</label>
                            <input
                                type="text"
                                placeholder="Your full name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="auth-input"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="auth-input"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                className="auth-input"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Role</label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="auth-input cursor-pointer"
                            >
                                <option value="CUSTOMER" className="bg-[#1a1040] text-white">Customer</option>
                                <option value="VENDOR" className="bg-[#1a1040] text-white">Vendor</option>
                                <option value="ADMIN" className="bg-[#1a1040] text-white">Admin</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn-primary w-full justify-center py-4 text-base mt-1">
                            Create Account
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                        {/* Message */}
                        {message && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                                message.includes("✓")
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                                    : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                            }`}>
                                <span className="text-lg">{message.includes("✓") ? "✅" : "⚠️"}</span>
                                {message}
                            </div>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-1">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-slate-500 text-xs">or register using</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Social buttons */}
                        <div className="flex justify-center gap-4">
                            <button type="button" className="social-btn bg-[#3b5998] hover:bg-[#4a6fbb] text-white font-bold text-lg">
                                f
                            </button>
                            <button type="button" className="social-btn bg-white hover:bg-slate-100 text-[#4285F4] font-black text-lg">
                                G
                            </button>
                        </div>

                        {/* Login link */}
                        <p className="text-center text-slate-400 text-sm pt-1">
                            Already have an account?{" "}
                            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}