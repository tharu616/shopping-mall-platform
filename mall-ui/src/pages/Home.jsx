import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";
import "./Home.css"; // We'll create this for animations

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
        <div style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            backgroundColor: "#f8f9fa",
            overflow: "hidden",
            margin: 0,  // ✅ Add this
            padding: 0  // ✅ Add this
        }}>
            {/* Hero Section with Modern Gradient */}
            <section style={{
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 50%, #2E2566 100%)",
                minHeight: "90vh",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Animated Background Shapes */}
                <div style={{
                    position: "absolute",
                    top: "-50%",
                    right: "-10%",
                    width: "600px",
                    height: "600px",
                    background: "rgba(255, 165, 0, 0.1)",
                    borderRadius: "50%",
                    filter: "blur(100px)"
                }} />
                <div style={{
                    position: "absolute",
                    bottom: "-30%",
                    left: "-5%",
                    width: "500px",
                    height: "500px",
                    background: "rgba(30, 144, 255, 0.15)",
                    borderRadius: "50%",
                    filter: "blur(80px)"
                }} />

                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "80px 40px",
                    position: "relative",
                    zIndex: 1
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "60px",
                        alignItems: "center"
                    }}>
                        {/* Left Content */}
                        <div>
                            <div style={{
                                display: "inline-block",
                                padding: "8px 20px",
                                background: "rgba(255, 165, 0, 0.2)",
                                borderRadius: "50px",
                                marginBottom: "24px",
                                border: "1px solid rgba(255, 165, 0, 0.3)"
                            }}>
                                <span style={{
                                    color: "#FFA500",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    letterSpacing: "1px"
                                }}>
                                    ✨ WELCOME TO THE FUTURE OF SHOPPING
                                </span>
                            </div>

                            <h1 style={{
                                fontSize: "64px",
                                fontWeight: "800",
                                color: "white",
                                marginBottom: "24px",
                                lineHeight: "1.1",
                                letterSpacing: "-2px"
                            }}>
                                Discover
                                <span style={{
                                    background: "linear-gradient(90deg, #FFA500, #FF6B6B)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    display: "block"
                                }}>
                                    Amazing Products
                                </span>
                            </h1>

                            <p style={{
                                fontSize: "20px",
                                color: "rgba(255,255,255,0.8)",
                                marginBottom: "40px",
                                lineHeight: "1.6",
                                maxWidth: "500px"
                            }}>
                                Experience next-level shopping with curated collections, exclusive deals, and lightning-fast delivery.
                            </p>

                            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                                <Link to="/register" style={{ textDecoration: "none" }}>
                                    <button style={{
                                        padding: "18px 40px",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        boxShadow: "0 10px 30px rgba(255, 165, 0, 0.4)",
                                        transition: "all 0.3s ease",
                                        transform: "translateY(0)"
                                    }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = "translateY(-3px)";
                                                e.target.style.boxShadow = "0 15px 40px rgba(255, 165, 0, 0.6)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = "0 10px 30px rgba(255, 165, 0, 0.4)";
                                            }}
                                    >
                                        Get Started Free →
                                    </button>
                                </Link>

                                <Link to="/products" style={{ textDecoration: "none" }}>
                                    <button style={{
                                        padding: "18px 40px",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        background: "rgba(255,255,255,0.1)",
                                        color: "white",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        backdropFilter: "blur(10px)",
                                        transition: "all 0.3s ease"
                                    }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "rgba(255,255,255,0.2)";
                                                e.target.style.borderColor = "rgba(255,255,255,0.5)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "rgba(255,255,255,0.1)";
                                                e.target.style.borderColor = "rgba(255,255,255,0.3)";
                                            }}
                                    >
                                        Explore Products
                                    </button>
                                </Link>
                            </div>

                            {/* Stats Row */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "20px",
                                marginTop: "60px"
                            }}>
                                <StatBadge number={`${stats.products}+`} label="Products" />
                                <StatBadge number="1K+" label="Customers" />
                                <StatBadge number="500+" label="Orders" />
                            </div>
                        </div>

                        {/* Right Content - Floating Card */}
                        <div style={{ position: "relative" }}>
                            <div style={{
                                background: "rgba(255,255,255,0.1)",
                                backdropFilter: "blur(20px)",
                                borderRadius: "24px",
                                padding: "40px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                transform: "perspective(1000px) rotateY(-5deg)"
                            }}>
                                <div style={{ fontSize: "120px", textAlign: "center", marginBottom: "20px" }}>
                                    🛍️
                                </div>
                                <h3 style={{
                                    color: "white",
                                    fontSize: "24px",
                                    textAlign: "center",
                                    marginBottom: "12px"
                                }}>
                                    Shop With Confidence
                                </h3>
                                <p style={{
                                    color: "rgba(255,255,255,0.7)",
                                    textAlign: "center",
                                    lineHeight: "1.6"
                                }}>
                                    Secure payments, fast delivery, and 24/7 customer support
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: "100px 40px", background: "white" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "60px" }}>
                        <h2 style={{
                            fontSize: "48px",
                            fontWeight: "800",
                            color: "#1A1A2E",
                            marginBottom: "16px"
                        }}>
                            Why Choose Us?
                        </h2>
                        <p style={{ fontSize: "18px", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
                            Experience the perfect blend of quality, convenience, and innovation
                        </p>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "30px"
                    }}>
                        <FeatureCard
                            gradient="linear-gradient(135deg, #1E90FF, #4B368B)"
                            icon="🚀"
                            title="Lightning Fast"
                            description="Get your orders delivered in record time with our express shipping"
                        />
                        <FeatureCard
                            gradient="linear-gradient(135deg, #FFA500, #FF6B6B)"
                            icon="💎"
                            title="Premium Quality"
                            description="Curated selection of high-quality products from trusted brands"
                        />
                        <FeatureCard
                            gradient="linear-gradient(135deg, #4B368B, #2E2566)"
                            icon="🔒"
                            title="Secure Payments"
                            description="Bank-level security with multiple payment options"
                        />
                        <FeatureCard
                            gradient="linear-gradient(135deg, #1E90FF, #1A1A2E)"
                            icon="🎁"
                            title="Exclusive Deals"
                            description="Members-only discounts and special offers every day"
                        />
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section style={{ padding: "100px 40px", background: "#f8f9fa" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "60px" }}>
                            <h2 style={{
                                fontSize: "48px",
                                fontWeight: "800",
                                color: "#1A1A2E",
                                marginBottom: "16px"
                            }}>
                                Shop by Category
                            </h2>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: "24px"
                        }}>
                            {categories.map((cat, index) => (
                                <CategoryCard key={cat.id} category={cat} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section style={{ padding: "100px 40px", background: "white" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "60px"
                        }}>
                            <div>
                                <h2 style={{
                                    fontSize: "48px",
                                    fontWeight: "800",
                                    color: "#1A1A2E",
                                    marginBottom: "8px"
                                }}>
                                    Trending Now
                                </h2>
                                <p style={{ fontSize: "18px", color: "#666" }}>
                                    Most popular products this week
                                </p>
                            </div>
                            <Link to="/products" style={{ textDecoration: "none" }}>
                                <button style={{
                                    padding: "14px 28px",
                                    background: "linear-gradient(135deg, #1E90FF, #4B368B)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "10px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s"
                                }}>
                                    View All →
                                </button>
                            </Link>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: "30px"
                        }}>
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section style={{
                background: "linear-gradient(135deg, #2E2566 0%, #1A1A2E 100%)",
                padding: "100px 40px",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "800px",
                    height: "800px",
                    background: "radial-gradient(circle, rgba(255,165,0,0.1), transparent 70%)",
                    pointerEvents: "none"
                }} />

                <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                    <h2 style={{
                        fontSize: "56px",
                        fontWeight: "800",
                        color: "white",
                        marginBottom: "24px"
                    }}>
                        Ready to Start Shopping?
                    </h2>
                    <p style={{
                        fontSize: "20px",
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: "40px",
                        lineHeight: "1.6"
                    }}>
                        Join thousands of happy customers. Create your account and unlock exclusive benefits today!
                    </p>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                        <button style={{
                            padding: "20px 50px",
                            fontSize: "18px",
                            fontWeight: "700",
                            background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                            color: "white",
                            border: "none",
                            borderRadius: "14px",
                            cursor: "pointer",
                            boxShadow: "0 15px 40px rgba(255, 165, 0, 0.5)",
                            transition: "all 0.3s"
                        }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-5px)";
                                    e.target.style.boxShadow = "0 20px 50px rgba(255, 165, 0, 0.7)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 15px 40px rgba(255, 165, 0, 0.5)";
                                }}
                        >
                            Create Free Account
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                background: "#1A1A2E",
                padding: "60px 40px 30px",
                color: "white"
            }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "40px",
                        marginBottom: "40px"
                    }}>
                        <div>
                            <h3 style={{ fontSize: "24px", marginBottom: "16px", fontWeight: "700" }}>
                                🛒 Our Mall
                            </h3>
                            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
                                Your trusted destination for quality products and amazing shopping experience.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: "16px", fontWeight: "600" }}>Quick Links</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <Link to="/products" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Products</Link>
                                <Link to="/categories" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Categories</Link>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: "16px", fontWeight: "600" }}>Account</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <Link to="/login" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Login</Link>
                                <Link to="/register" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Sign Up</Link>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        textAlign: "center",
                        paddingTop: "30px",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)"
                    }}>
                        © 2025 Our Mall. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Component: Stat Badge
function StatBadge({ number, label }) {
    return (
        <div>
            <div style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#FFA500",
                marginBottom: "4px"
            }}>
                {number}
            </div>
            <div style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: "500"
            }}>
                {label}
            </div>
        </div>
    );
}

// Component: Feature Card
function FeatureCard({ gradient, icon, title, description }) {
    return (
        <div style={{
            background: "white",
            padding: "40px 30px",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            transition: "all 0.4s ease",
            border: "1px solid #f0f0f0",
            cursor: "pointer"
        }}
             onMouseEnter={(e) => {
                 e.currentTarget.style.transform = "translateY(-10px)";
                 e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.15)";
             }}
             onMouseLeave={(e) => {
                 e.currentTarget.style.transform = "translateY(0)";
                 e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.08)";
             }}
        >
            <div style={{
                width: "70px",
                height: "70px",
                background: gradient,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "24px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
            }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#1A1A2E",
                marginBottom: "12px"
            }}>
                {title}
            </h3>
            <p style={{
                color: "#666",
                lineHeight: "1.6",
                fontSize: "15px"
            }}>
                {description}
            </p>
        </div>
    );
}

// Component: Category Card
function CategoryCard({ category, index }) {
    const gradients = [
        "linear-gradient(135deg, #1E90FF, #4B368B)",
        "linear-gradient(135deg, #FFA500, #FF6B6B)",
        "linear-gradient(135deg, #4B368B, #2E2566)",
        "linear-gradient(135deg, #1E90FF, #1A1A2E)"
    ];

    return (
        <Link to={`/products?category=${category.id}`} style={{ textDecoration: "none" }}>
            <div style={{
                background: gradients[index % gradients.length],
                padding: "50px 30px",
                borderRadius: "20px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
            }}
                 onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "scale(1.05)";
                 }}
                 onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "scale(1)";
                 }}
            >
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>
                    {getCategoryIcon(category.name)}
                </div>
                <h3 style={{
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "700",
                    marginBottom: "8px"
                }}>
                    {category.name}
                </h3>
                <p style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "14px"
                }}>
                    {category.description || "Explore collection"}
                </p>
            </div>
        </Link>
    );
}

// Component: Product Card
function ProductCard({ product }) {
    return (
        <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
            <div style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                border: "1px solid #f0f0f0",
                cursor: "pointer"
            }}
                 onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "translateY(-8px)";
                     e.currentTarget.style.boxShadow = "0 15px 50px rgba(0,0,0,0.15)";
                 }}
                 onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.boxShadow = "none";
                 }}
            >
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
                    {product.stock <= 10 && product.stock > 0 && (
                        <div style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            background: "#FF6B6B",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600"
                        }}>
                            Low Stock
                        </div>
                    )}
                </div>
                <div style={{ padding: "24px" }}>
                    <h3 style={{
                        fontSize: "18px",
                        fontWeight: "600",
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
                        height: "40px",
                        overflow: "hidden"
                    }}>
                        {product.description}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            background: "linear-gradient(135deg, #FFA500, #FF6B6B)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            ${product.price}
                        </span>
                        <span style={{
                            fontSize: "13px",
                            color: product.stock > 0 ? "#4CAF50" : "#FF6B6B",
                            fontWeight: "600",
                            padding: "6px 12px",
                            background: product.stock > 0 ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 107, 107, 0.1)",
                            borderRadius: "8px"
                        }}>
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
        "Electronics": "💻",
        "Clothing": "👕",
        "Books": "📚",
        "Food": "🍔",
        "Toys": "🧸",
        "Sports": "⚽",
        "Beauty": "💄",
        "Home": "🏠"
    };
    for (const [key, icon] of Object.entries(icons)) {
        if (name.toLowerCase().includes(key.toLowerCase())) return icon;
    }
    return "📦";
}
