import { useEffect, useState } from "react";
import API from "../../api/API";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        API.get("/users/me").then(res => {
            setUser(res.data);
            setFullName(res.data.fullName);
        }).catch(console.error);
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put("/users/me", { fullName });
            setUser(res.data);
            setMsg("✓ Profile updated successfully!");
        } catch (err) {
            setMsg(err.response?.data?.message || "Update failed");
        }
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 text-sm">Loading profile...</p>
            </div>
        </div>
    );

    const roleColors = {
        ADMIN: "from-rose-500 to-pink-600",
        VENDOR: "from-violet-500 to-purple-700",
        CUSTOMER: "from-blue-500 to-cyan-600",
    };
    const roleGrad = roleColors[user.role] || "from-slate-500 to-slate-700";

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto">

                {/* Page title */}
                <div className="text-center mb-10">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Account</p>
                    <h1 className="text-5xl font-black text-white tracking-tight">My Profile</h1>
                </div>

                <div className="glass-card">
                    {/* Avatar + identity */}
                    <div className="flex flex-col items-center mb-10">
                        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${roleGrad} flex items-center justify-center text-4xl font-black text-white mb-5 shadow-2xl`}>
                            {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-1">{user.fullName}</h2>
                        <p className="text-slate-400 text-sm mb-3">{user.email}</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${roleGrad} text-white`}>
                            {user.role}
                        </span>
                    </div>

                    {/* Info cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Email</p>
                            <p className="text-white text-sm font-semibold truncate">{user.email}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Role</p>
                            <p className="text-white text-sm font-semibold">{user.role}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/10 mb-8" />

                    {/* Update form */}
                    <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">
                                Full Name
                            </label>
                            <input
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="auth-input"
                                placeholder="Your full name"
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full justify-center py-4">
                            Save Changes
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>

                        {msg && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                                msg.includes("✓")
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                                    : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                            }`}>
                                <span>{msg.includes("✓") ? "✅" : "⚠️"}</span>
                                {msg}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}