import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function CustomerDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0, pendingOrders: 0, completedOrders: 0,
        totalSpent: 0, cartItems: 0, pendingPayments: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDashboardData(); }, []);

    async function fetchDashboardData() {
        try {
            const [ordersRes, cartRes, paymentsRes] = await Promise.all([
                API.get("/orders"), API.get("/cart"), API.get("/payments/mine")
            ]);
            const orders = ordersRes.data, cart = cartRes.data, payments = paymentsRes.data;
            setStats({
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => o.status === "PENDING").length,
                completedOrders: orders.filter(o => o.status === "DELIVERED").length,
                totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
                cartItems: cart.items?.length || 0,
                pendingPayments: payments.filter(p => p.status === "PENDING").length
            });
            setRecentOrders(orders.slice(0, 5));
        } catch (err) {
            console.error("Failed to load dashboard data", err);
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
        { label: "Total Orders",      value: stats.totalOrders,                   icon: "🛒", grad: "from-blue-500 to-violet-600"   },
        { label: "Pending Orders",    value: stats.pendingOrders,                 icon: "⏳", grad: "from-amber-400 to-orange-500"   },
        { label: "Completed Orders",  value: stats.completedOrders,               icon: "✅", grad: "from-emerald-500 to-teal-600"   },
        { label: "Total Spent",       value: `$${stats.totalSpent.toFixed(2)}`,   icon: "💰", grad: "from-violet-500 to-purple-700"  },
        { label: "Cart Items",        value: stats.cartItems,                     icon: "🛍️", grad: "from-blue-400 to-cyan-500"     },
        { label: "Pending Payments",  value: stats.pendingPayments,               icon: "💳", grad: "from-rose-500 to-pink-600"     },
    ];

    const quickActions = [
        { label: "Browse Products", icon: "🛍️", link: "/products",  grad: "from-blue-500 to-violet-600"  },
        { label: "My Cart",         icon: "🛒", link: "/cart",       grad: "from-emerald-500 to-teal-600" },
        { label: "My Orders",       icon: "📦", link: "/orders",     grad: "from-violet-500 to-purple-700"},
        { label: "My Payments",     icon: "💳", link: "/payments",   grad: "from-amber-400 to-orange-500" },
    ];

    const statusConfig = {
        DELIVERED: { label: "Delivered", classes: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
        PENDING:   { label: "Pending",   classes: "bg-amber-400/10 border-amber-400/30 text-amber-400"       },
        CANCELLED: { label: "Cancelled", classes: "bg-rose-500/10 border-rose-500/30 text-rose-400"          },
        SHIPPED:   { label: "Shipped",   classes: "bg-blue-500/10 border-blue-500/30 text-blue-400"          },
        CONFIRMED: { label: "Confirmed", classes: "bg-violet-500/10 border-violet-500/30 text-violet-400"    },
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a] px-4 py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <span>👤</span> Customer Portal
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">My Dashboard</h1>
                    <p className="text-slate-400 text-lg">Track your orders and shopping activity</p>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {statCards.map((stat, i) => (
                        <div key={i} className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{stat.label}</p>
                                    <p className="text-white text-4xl font-black">{stat.value}</p>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.grad} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
                    <div className="glass-card mb-8">
                        <h2 className="text-white text-xl font-black mb-7 flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-base">📦</span>
                            Recent Orders
                        </h2>
                        <div className="flex flex-col gap-3">
                            {recentOrders.map((order, i) => {
                                const sc = statusConfig[order.status] || statusConfig.PENDING;
                                return (
                                    <div key={i} className="flex items-center justify-between gap-4 p-4 bg-white/[0.02] border border-white/8 hover:border-white/15 rounded-xl transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg flex-shrink-0">
                                                📦
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">Order #{order.id}</p>
                                                <p className="text-slate-500 text-xs">{order.items?.length || 0} items</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-white font-black text-base">${order.total.toFixed(2)}</span>
                                            <span className={`px-3 py-1 rounded-full border text-xs font-black ${sc.classes}`}>
                                                {sc.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                                <span className="text-slate-300 group-hover:text-white text-sm font-bold transition-colors">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}