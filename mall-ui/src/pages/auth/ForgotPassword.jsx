import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        try {
            await API.post("/auth/forgot-password", { email });
            setSuccess(true);
            setMessage("✓ Password reset link sent to your email!");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to send reset link");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] animate-floatSlow pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] animate-floatSlow pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/login" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                        ← Back to Login
                    </Link>
                </div>

                <div className="glass-card">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-blue-500/30">
                            🔑
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Forgot Password?</h1>
                        <p className="text-slate-400 text-sm">Enter your email to receive a reset link</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="auth-input"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn-primary w-full justify-center py-4 text-base mt-1 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Link
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {message && !success && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium">
                                    <span className="text-lg">⚠️</span>
                                    {message}
                                </div>
                            )}
                        </form>
                    ) : (
                        /* ── Success state ── */
                        <div className="text-center flex flex-col items-center gap-5">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-4xl">
                                ✅
                            </div>
                            <div className="flex items-center gap-3 w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                                <span>✓</span> {message}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Check your email inbox and click the reset link to continue.
                            </p>
                            <Link to="/login" className="w-full">
                                <button className="btn-primary w-full justify-center py-4">
                                    Return to Login
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}