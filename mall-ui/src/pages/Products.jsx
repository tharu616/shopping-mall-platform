import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
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

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)"
            }}>
                <div style={{
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "600"
                }}>
                    Loading products...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)"
        }}>
            {/* Header Section with Gradient */}
            <div style={{
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 50%, #2E2566 100%)",
                padding: "60px 40px",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Animated Background Circle */}
                <div style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-5%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(255,165,0,0.2), transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(60px)"
                }} />

                <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <h1 style={{
                        fontSize: "48px",
                        fontWeight: "800",
                        color: "white",
                        marginBottom: "16px",
                        letterSpacing: "-1px"
                    }}>
                        Our Products
                    </h1>
                    <p style={{
                        fontSize: "18px",
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: "30px"
                    }}>
                        Discover our curated collection of premium products
                    </p>

                    {/* Search Bar */}
                    <div style={{
                        maxWidth: "600px",
                        position: "relative"
                    }}>
                        <input
                            type="text"
                            placeholder="🔍 Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "16px 24px",
                                borderRadius: "50px",
                                border: "1px solid rgba(255,255,255,0.3)",
                                background: "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(10px)",
                                color: "white",
                                fontSize: "16px",
                                outline: "none",
                                transition: "all 0.3s"
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "60px 40px"
            }}>
                {/* Add Product Button (for Admin/Vendor) */}
                {(role === "ADMIN" || role === "VENDOR") && (
                    <div style={{ marginBottom: "30px" }}>
                        <Link to="/products/create">
                            <button style={{
                                padding: "14px 32px",
                                background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: "pointer",
                                boxShadow: "0 8px 20px rgba(255,165,0,0.3)",
                                transition: "all 0.3s"
                            }}>
                                + Add New Product
                            </button>
                        </Link>
                    </div>
                )}

                {/* Products Count */}
                <div style={{
                    marginBottom: "30px",
                    color: "#666",
                    fontSize: "16px"
                }}>
                    Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''}
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#999"
                    }}>
                        <div style={{ fontSize: "64px", marginBottom: "20px" }}>📦</div>
                        <h3 style={{ fontSize: "24px", color: "#666", marginBottom: "10px" }}>
                            No products found
                        </h3>
                        <p>Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "30px"
                    }}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ product }) {
    return (
        <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
            <div style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.4s ease",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
                 onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "translateY(-10px)";
                     e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                 }}
                 onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                 }}
            >
                {/* Product Image */}
                <div style={{
                    height: "240px",
                    background: "linear-gradient(135deg, #f5f7fa 0%, #e8ebf0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "80px",
                    position: "relative"
                }}>
                    📦

                    {/* Stock Badge */}
                    {product.stock <= 10 && product.stock > 0 ? (
                        <div style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            background: "#FFA500",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            boxShadow: "0 4px 10px rgba(255,165,0,0.3)"
                        }}>
                            Low Stock
                        </div>
                    ) : product.stock === 0 ? (
                        <div style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            background: "#dc3545",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700"
                        }}>
                            Out of Stock
                        </div>
                    ) : null}
                </div>

                {/* Product Info */}
                <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1A1A2E",
                        marginBottom: "8px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
                        {product.name}
                    </h3>

                    <p style={{
                        color: "#666",
                        fontSize: "14px",
                        marginBottom: "16px",
                        lineHeight: "1.5",
                        height: "42px",
                        overflow: "hidden",
                        flex: 1
                    }}>
                        {product.description}
                    </p>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto"
                    }}>
                        <span style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            ${product.price}
                        </span>

                        <span style={{
                            fontSize: "13px",
                            color: product.stock > 0 ? "#4CAF50" : "#dc3545",
                            fontWeight: "600",
                            padding: "6px 14px",
                            background: product.stock > 0 ? "rgba(76,175,80,0.1)" : "rgba(220,53,69,0.1)",
                            borderRadius: "20px"
                        }}>
                            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
