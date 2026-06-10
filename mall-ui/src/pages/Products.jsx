import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../AuthContext";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { role } = useAuth();

    useEffect(() => {
        API.get("/products")
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false));
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-slate-400 font-semibold">Loading products...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a1a]">

            {/* ── Hero Header ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0d0d2b] via-[#1a1040] to-[#0a0a1a] py-20 px-6">
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-5%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 grid-overlay pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Catalogue</p>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">Our Products</h1>
                    <p className="text-slate-400 text-lg mb-10 max-w-xl">
                        Discover our curated collection of premium products
                    </p>

                    {/* Search */}
                    <div className="relative max-w-xl">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white placeholder-slate-500 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <p className="text-slate-400 text-sm">
                        Showing <span className="text-white font-bold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
                    </p>
                    {(role === "ADMIN" || role === "VENDOR") && (
                        <Link to="/products/create">
                            <button className="btn-primary">
                                <span className="text-lg leading-none">+</span>
                                Add New Product
                            </button>
                        </Link>
                    )}
                </div>

                {/* Empty state */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl mb-6">📦</div>
                        <h3 className="text-white text-2xl font-bold mb-2">No products found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    return (
        <Link to={`/products/${product.id}`}>
            <div className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer flex flex-col h-full">

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                    {product.imageUrl ? (
                        <img
                            src={`http://localhost:8081${product.imageUrl}?t=${new Date().getTime()}`}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a1040] to-[#0d0d2b] flex items-center justify-center text-6xl">
                            📦
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {product.stock <= 10 && product.stock > 0 && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-amber-400/90 text-black text-xs font-black rounded-full backdrop-blur-sm">
                            Low Stock
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-rose-500/90 text-white text-xs font-black rounded-full backdrop-blur-sm">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-white font-bold text-base truncate mb-2">{product.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
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