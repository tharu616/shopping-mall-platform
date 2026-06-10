import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../AuthContext";
import "./Home.css";

export default function Home() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0 });

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
            return;
        }
        fetchHomeData();
    }, [token, navigate]);

    async function fetchHomeData() {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                API.get("/products"),
                API.get("/categories")
            ]);
            setFeaturedProducts(productsRes.data.slice(0, 6));
            setCategories(categoriesRes.data.slice(0, 4));
            setStats({
                products: productsRes.data.length,
                customers: 1000,
                orders: 500
            });
        } catch (err) {
            console.error("Failed to load home data", err);
        }
    }

    if (token) return null;

    return (
        <div className="font-inter bg-[#0a0a1a] overflow-x-hidden">

            {/* ── Hero ── */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0d0d2b] via-[#1a1040] to-[#0a0a1a]">
                {/* Glow orbs */}
                <div className="orb orb-blue" />
                <div className="orb orb-amber" />
                <div className="orb orb-violet" />

                {/* Grid overlay */}
                <div className="absolute inset-0 grid-overlay pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-28 w-full">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left */}
                        <div className="animate-fadeInUp">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-8">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                Welcome to the Future of Shopping
                            </span>

                            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-7">
                                Discover
                                <span className="block gradient-text-hero">
                                    Amazing Products
                                </span>
                            </h1>

                            <p className="text-lg text-slate-400 max-w-lg leading-relaxed mb-10">
                                Experience next-level shopping with curated collections, exclusive deals, and lightning-fast delivery.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-16">
                                <Link to="/register">
                                    <button className="btn-primary">
                                        Get Started Free
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </Link>
                                <Link to="/products">
                                    <button className="btn-ghost">
                                        Explore Products
                                    </button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                                <StatBadge number={`${stats.products}+`} label="Products" />
                                <StatBadge number="1K+" label="Customers" />
                                <StatBadge number="500+" label="Orders" />
                            </div>
                        </div>

                        {/* Right – floating card */}
                        <div className="hidden lg:flex justify-center animate-floatSlow">
                            <div className="glass-card w-80 text-center">
                                <div className="text-9xl mb-6 drop-shadow-2xl">🛍️</div>
                                <h3 className="text-white text-2xl font-bold mb-3">Shop With Confidence</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    Secure payments, fast delivery, and 24/7 customer support
                                </p>
                                <div className="mt-6 flex justify-center gap-3">
                                    {["🔒","⚡","🎁"].map((e, i) => (
                                        <span key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg border border-white/10">{e}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-28 bg-[#0d0d20]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="text-center mb-16">
                        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Our Advantages</p>
                        <h2 className="text-5xl font-black text-white mb-4">Why Choose Us?</h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            Experience the perfect blend of quality, convenience, and innovation
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            gradient="from-blue-500 to-violet-600"
                            icon="🚀"
                            title="Lightning Fast"
                            description="Get your orders delivered in record time with our express shipping"
                        />
                        <FeatureCard
                            gradient="from-amber-400 to-orange-500"
                            icon="💎"
                            title="Premium Quality"
                            description="Curated selection of high-quality products from trusted brands"
                        />
                        <FeatureCard
                            gradient="from-violet-600 to-purple-800"
                            icon="🔒"
                            title="Secure Payments"
                            description="Bank-level security with multiple payment options"
                        />
                        <FeatureCard
                            gradient="from-cyan-400 to-blue-600"
                            icon="🎁"
                            title="Exclusive Deals"
                            description="Members-only discounts and special offers every day"
                        />
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            {categories.length > 0 && (
                <section className="py-28 bg-[#0a0a1a]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-16">
                        <div className="text-center mb-16">
                            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Browse</p>
                            <h2 className="text-5xl font-black text-white">Shop by Category</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat, index) => (
                                <CategoryCard key={cat.id} category={cat} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Featured Products ── */}
            {featuredProducts.length > 0 && (
                <section className="py-28 bg-[#0d0d20]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-16">
                        <div className="flex flex-wrap justify-between items-end gap-6 mb-16">
                            <div>
                                <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">This Week</p>
                                <h2 className="text-5xl font-black text-white mb-2">Trending Now</h2>
                                <p className="text-slate-400 text-lg">Most popular products this week</p>
                            </div>
                            <Link to="/products">
                                <button className="btn-primary">
                                    View All
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </button>
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#1a0a40] via-[#0d0d2b] to-[#0a1a2e]">
                <div className="orb orb-cta-amber" />
                <div className="orb orb-cta-blue" />

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-8">
                        Join Us Today
                    </span>
                    <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-slate-400 text-xl mb-10 leading-relaxed">
                        Join thousands of happy customers. Create your account and unlock exclusive benefits today!
                    </p>
                    <Link to="/register">
                        <button className="btn-primary text-lg px-12 py-5">
                            Create Free Account
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#06060f] border-t border-white/5 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid sm:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🛒</span>
                                <span className="text-white text-xl font-black tracking-tight">Our Mall</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Your trusted destination for quality products and an amazing shopping experience.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
                            <div className="flex flex-col gap-3">
                                <Link to="/products" className="footer-link">Products</Link>
                                <Link to="/categories" className="footer-link">Categories</Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Account</h4>
                            <div className="flex flex-col gap-3">
                                <Link to="/login" className="footer-link">Login</Link>
                                <Link to="/register" className="footer-link">Sign Up</Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 text-center text-slate-600 text-sm">
                        © 2025 Our Mall. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ── Sub-components ──

function StatBadge({ number, label }) {
    return (
        <div>
            <div className="text-3xl font-black text-amber-400 mb-1">{number}</div>
            <div className="text-slate-400 text-sm font-medium">{label}</div>
        </div>
    );
}

function FeatureCard({ gradient, icon, title, description }) {
    return (
        <div className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function CategoryCard({ category, index }) {
    const styles = [
        { from: "from-blue-600", to: "to-violet-700", border: "hover:border-blue-500/40" },
        { from: "from-amber-500", to: "to-orange-600", border: "hover:border-amber-500/40" },
        { from: "from-violet-600", to: "to-purple-800", border: "hover:border-violet-500/40" },
        { from: "from-cyan-500", to: "to-blue-700", border: "hover:border-cyan-500/40" },
    ];
    const s = styles[index % styles.length];

    return (
        <Link to={`/products?category=${category.id}`}>
            <div className={`group relative rounded-2xl p-8 text-center border border-white/10 ${s.border} bg-white/[0.03] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${s.from} ${s.to} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="text-5xl mb-5">{getCategoryIcon(category.name)}</div>
                <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-slate-400 text-sm">{category.description || "Explore collection"}</p>
                <div className={`mt-5 inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r ${s.from} ${s.to} bg-clip-text text-transparent`}>
                    Shop Now
                    <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>
        </Link>
    );
}

function ProductCard({ product }) {
    return (
        <Link to={`/products/${product.id}`}>
            <div className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer">
                {/* Image area */}
                <div className="relative h-56 bg-gradient-to-br from-[#1a1040] to-[#0d0d2b] flex items-center justify-center text-7xl overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/40 to-transparent" />
                    📦
                    {product.stock <= 10 && product.stock > 0 && (
                        <span className="absolute top-3 right-3 bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="p-6">
                    <h3 className="text-white text-base font-semibold truncate mb-2">{product.name}</h3>
                    <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black gradient-text-price">${product.price}</span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            product.stock > 0
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Helper
function getCategoryIcon(name) {
    const icons = {
        "Electronics": "💻", "Clothing": "👕", "Books": "📚",
        "Food": "🍔", "Toys": "🧸", "Sports": "⚽",
        "Beauty": "💄", "Home": "🏠"
    };
    for (const [key, icon] of Object.entries(icons)) {
        if (name.toLowerCase().includes(key.toLowerCase())) return icon;
    }
    return "📦";
}