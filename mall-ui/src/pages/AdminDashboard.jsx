import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0, totalProducts: 0, totalOrders: 0,
        pendingPayments: 0, pendingReviews: 0, totalRevenue: 0, activeDiscounts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { fetchDashboardData(); }, []);

    async function fetchDashboardData() {
        try {
            const results = await Promise.allSettled([
                API.get("/products"),
                API.get("/orders/all"),
                API.get("/payments/pending"),
                API.get("/api/reviews/pending"),
                API.get("/discounts").catch(() => ({ data: [] }))
            ]);
            const products  = results[0].status === "fulfilled" ? results[0].value.data : [];
            const orders    = results[1].status === "fulfilled" ? results[1].value.data : [];
            const payments  = results[2].status === "fulfilled" ? results[2].value.data : [];
            const reviews   = results[3].status === "fulfilled" ? results[3].value.data : [];
            const discounts = results[4].status === "fulfilled" ? results[4].value.data : [];
            console.log("Dashboard Data:", { products, orders, payments, reviews, discounts });
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
            const activeDiscountsCount = Array.isArray(discounts)
                ? discounts.filter(d => d.active === true || d.active === "true").length : 0;
            setStats({
                totalUsers: 0, totalProducts: products.length, totalOrders: orders.length,
                pendingPayments: payments.length, pendingReviews: reviews.length,
                totalRevenue, activeDiscounts: activeDiscountsCount
            });
        } catch (err) {
            console.error("Failed to load dashboard data", err);
            setError("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading dashboard...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4">
            <div className="glass-card max-w-sm w-full text-center">
                <div className="text-5xl mb-5">⚠️</div>
                <h2 className="text-white text-xl font-black mb-3">Dashboard Error</h2>
                <p className="text-slate-400 text-sm mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary w-full justify-center py-3">
                    Retry
                </button>
            </div>
        </div>
    );

    const statCards = [
        { label: "Total Products",    value: stats.totalProducts,                   icon: "📦", grad: "from-blue-500 to-violet-600",   glow: "blue"    },
        { label: "Total Orders",      value: stats.totalOrders,                     icon: "🛒", grad: "from-emerald-500 to-teal-600",   glow: "emerald" },
        { label: "Pending Payments",  value: stats.pendingPayments,                 icon: "💳", grad: "from-amber-400 to-orange-500",   glow: "amber"   },
        { label: "Pending Reviews",   value: stats.pendingReviews,                  icon: "⭐", grad: "from-violet-500 to-purple-700",  glow: "violet"  },
        { label: "Total Revenue",     value: `$${stats.totalRevenue.toFixed(2)}`,   icon: "💰", grad: "from-emerald-400 to-green-600",  glow: "emerald" },
        { label: "Active Discounts",  value: stats.activeDiscounts,                 icon: "🏷️", grad: "from-rose-500 to-pink-600",     glow: "rose"    },
    ];

    const quickActions = [
        { label: "Manage Products",  icon: "📦", link: "/products",        grad: "from-blue-500 to-violet-600"   },
        { label: "View Orders",      icon: "🛒", link: "/orders",          grad: "from-emerald-500 to-teal-600"  },
        { label: "Payments",         icon: "💳", link: "/payments",        grad: "from-amber-400 to-orange-500"  },
        { label: "Payment History",  icon: "📊", link: "/payment-history", grad: "from-cyan-500 to-blue-600"     },
        { label: "Categories",       icon: "🗂️", link: "/categories",      grad: "from-violet-500 to-purple-700" },
        { label: "Discounts",        icon: "🏷️", link: "/discounts",       grad: "from-rose-500 to-pink-600"     },
        { label: "Reviews",          icon: "⭐", link: "/api/reviews",     grad: "from-amber-400 to-yellow-500"  },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            {/* Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <span>👑</span> Admin Panel
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 text-lg">System overview and management</p>
                </div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {statCards.map((stat, i) => (
                        <div
                            key={i}
                            className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
                                        {stat.label}
                                    </p>
                                    <p className="text-white text-4xl font-black">{stat.value}</p>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.grad} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="glass-card">
                    <h2 className="text-white text-xl font-black mb-8 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center text-base">⚡</span>
                        Quick Actions
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, i) => (
                            <Link
                                key={i}
                                to={action.link}
                                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-white/20 hover:-translate-y-1 hover:bg-white/5 transition-all duration-200 text-center no-underline"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.grad} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                    {action.icon}
                                </div>
                                <span className="text-slate-300 group-hover:text-white text-sm font-bold transition-colors">
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}