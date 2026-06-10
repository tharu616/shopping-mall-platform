import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function VendorDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0, lowStockProducts: 0, totalOrders: 0,
        pendingOrders: 0, totalRevenue: 0, activeDiscounts: 0
    });
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => { fetchDashboardData(); }, []);

    async function fetchDashboardData() {
        setLoading(true); setError("");
        try {
            const [productsRes, ordersRes, discountsRes] = await Promise.all([
                API.get("/products").catch(err => { console.error("Products API error:", err); return { data: [] }; }),
                API.get("/orders").catch(err => { console.error("Orders API error:", err); return { data: [] }; }),
                API.get("/discounts").catch(err => { console.error("Discounts API error:", err); return { data: [] }; })
            ]);
            const products = Array.isArray(productsRes.data) ? productsRes.data : [];
            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
            const discounts = Array.isArray(discountsRes.data) ? discountsRes.data : [];
            const lowStock = products.filter(p => p.stock != null && p.stock < 10);
            const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
            const pendingCount = orders.filter(o => o.status && o.status.toUpperCase() === "PENDING").length;
            const activeDiscountCount = discounts.filter(d => d.active === true).length;
            setStats({ totalProducts: products.length, lowStockProducts: lowStock.length, totalOrders: orders.length, pendingOrders: pendingCount, totalRevenue, activeDiscounts: activeDiscountCount });
            setLowStockProducts(lowStock);
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
            setError("Failed to load dashboard data. Please try refreshing the page.");
        } finally { setLoading(false); }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading dashboard...</p>
            </div>
        </div>
    );

    const statCards = [
        { label: "Total Products",  value: stats.totalProducts,            icon: "📦", grad: "from-violet-600 to-purple-800",  glow: "shadow-violet-500/20" },
        { label: "Low Stock Alert", value: stats.lowStockProducts,         icon: "⚠️", grad: "from-amber-400 to-orange-500",   glow: "shadow-amber-500/20" },
        { label: "Total Orders",    value: stats.totalOrders,              icon: "🛒", grad: "from-blue-500 to-violet-600",    glow: "shadow-blue-500/20"  },
        { label: "Pending Orders",  value: stats.pendingOrders,            icon: "⏳", grad: "from-fuchsia-500 to-purple-700", glow: "shadow-fuchsia-500/20"},
        { label: "Total Revenue",   value: `$${stats.totalRevenue.toFixed(2)}`, icon: "💰", grad: "from-emerald-400 to-teal-600",  glow: "shadow-emerald-500/20"},
        { label: "Active Discounts",value: stats.activeDiscounts,          icon: "🏷️", grad: "from-rose-500 to-pink-700",     glow: "shadow-rose-500/20"  },
    ];

    const quickActions = [
        { label: "Add Product", icon: "➕", link: "/products/new", grad: "from-emerald-500 to-teal-600",   border: "border-emerald-500/30 hover:border-emerald-400" },
        { label: "My Products", icon: "📦", link: "/products",     grad: "from-violet-500 to-purple-700",  border: "border-violet-500/30 hover:border-violet-400"  },
        { label: "View Orders", icon: "🛒", link: "/orders",       grad: "from-blue-500 to-cyan-600",      border: "border-blue-500/30 hover:border-blue-400"      },
        { label: "Discounts",   icon: "🏷️", link: "/discounts",   grad: "from-rose-500 to-pink-600",      border: "border-rose-500/30 hover:border-rose-400"      },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Vendor Panel</p>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-3">
                        🏪 Vendor Dashboard
                    </h1>
                    <p className="text-slate-400 text-lg">Manage your store and inventory</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center justify-between gap-4 p-5 mb-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                        <span className="font-semibold text-sm">⚠️ {error}</span>
                        <button
                            onClick={fetchDashboardData}
                            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {statCards.map((stat, i) => (
                        <div key={i} className={`group bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl p-7 hover:-translate-y-2 transition-all duration-300 shadow-xl ${stat.glow}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{stat.label}</p>
                                    <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                                </div>
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.grad} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-white/[0.03] border border-amber-500/30 rounded-2xl p-8 mb-8 shadow-xl shadow-amber-500/10">
                        <h2 className="text-amber-400 text-xl font-black mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center text-base">⚠️</span>
                            Low Stock Products
                        </h2>
                        <div className="flex flex-col gap-3">
                            {lowStockProducts.slice(0, 5).map((product, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                                    <span className="text-white font-semibold text-sm">{product.name}</span>
                                    <span className="px-3 py-1 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold rounded-full">
                                        {product.stock} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                    <h2 className="text-white text-xl font-black mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center text-base">⚡</span>
                        Quick Actions
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.link}>
                                <div className={`group flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border ${action.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer`}>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.grad} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {action.icon}
                                    </div>
                                    <span className="text-white text-sm font-bold text-center">{action.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}