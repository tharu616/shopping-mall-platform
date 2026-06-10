import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import API from "../../api/api";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await API.post("/auth/login", form);
            login(res.data.token, res.data.role);
            navigate("/dashboard");
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a1a] px-4 py-16">

            {/* Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px] animate-floatSlow pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] animate-floatSlow pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                <div className="glass-card">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-amber-500/30">
                            🔑
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 text-sm">Login to continue shopping</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email */}
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                Email
                            </label>
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
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                className="auth-input"
                            />
                        </div>

                        {/* Forgot password */}
                        <div className="text-right -mt-2">
                            <Link to="/forgot-password" className="text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn-primary w-full justify-center py-4 text-base mt-1">
                            Login
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                        {/* Error message */}
                        {message && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium">
                                <span className="text-lg">⚠️</span>
                                {message}
                            </div>
                        )}

                        {/* Register link */}
                        <p className="text-center text-slate-400 text-sm pt-2">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}