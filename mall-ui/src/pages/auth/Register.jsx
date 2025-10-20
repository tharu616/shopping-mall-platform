import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await API.post("/auth/register", form);
            setMessage("✓ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 50%, #2E2566 100%)",
            position: "relative",
            overflow: "hidden",
            padding: "40px 20px"
        }}>
            {/* Animated Background Circles */}
            <div style={{
                position: "absolute",
                top: "-10%",
                right: "-5%",
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(255,165,0,0.3), transparent 70%)",
                borderRadius: "50%",
                filter: "blur(60px)",
                animation: "float 6s ease-in-out infinite"
            }} />
            <div style={{
                position: "absolute",
                bottom: "-15%",
                left: "-5%",
                width: "600px",
                height: "600px",
                background: "radial-gradient(circle, rgba(30,144,255,0.2), transparent 70%)",
                borderRadius: "50%",
                filter: "blur(80px)",
                animation: "float 8s ease-in-out infinite reverse"
            }} />

            {/* Glass Form Container */}
            <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "24px",
                padding: "50px 40px",
                width: "100%",
                maxWidth: "480px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                position: "relative",
                zIndex: 1
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "white",
                        marginBottom: "8px",
                        letterSpacing: "-1px"
                    }}>
                        Welcome
                    </h1>
                    <p style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "16px"
                    }}>
                        Create your account to get started
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Name Input */}
                    <div>
                        <label style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "8px",
                            display: "block"
                        }}>
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                background: "rgba(255, 255, 255, 0.15)",
                                color: "white",
                                fontSize: "15px",
                                outline: "none",
                                transition: "all 0.3s"
                            }}
                            onFocus={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.25)";
                                e.target.style.borderColor = "#FFA500";
                            }}
                            onBlur={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.15)";
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                            }}
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "8px",
                            display: "block"
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                background: "rgba(255, 255, 255, 0.15)",
                                color: "white",
                                fontSize: "15px",
                                outline: "none",
                                transition: "all 0.3s"
                            }}
                            onFocus={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.25)";
                                e.target.style.borderColor = "#FFA500";
                            }}
                            onBlur={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.15)";
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "8px",
                            display: "block"
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                background: "rgba(255, 255, 255, 0.15)",
                                color: "white",
                                fontSize: "15px",
                                outline: "none",
                                transition: "all 0.3s"
                            }}
                            onFocus={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.25)";
                                e.target.style.borderColor = "#FFA500";
                            }}
                            onBlur={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.15)";
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                            }}
                        />
                    </div>

                    {/* Role Select */}
                    <div>
                        <label style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "8px",
                            display: "block"
                        }}>
                            Role
                        </label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                background: "rgba(255, 255, 255, 0.15)",
                                color: "white",
                                fontSize: "15px",
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="CUSTOMER" style={{ background: "#2E2566", color: "white" }}>Customer</option>
                            <option value="VENDOR" style={{ background: "#2E2566", color: "white" }}>Vendor</option>
                            <option value="ADMIN" style={{ background: "#2E2566", color: "white" }}>Admin</option>
                        </select>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "none",
                            background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                            marginTop: "10px",
                            boxShadow: "0 8px 24px rgba(255, 165, 0, 0.4)",
                            transition: "all 0.3s",
                            letterSpacing: "0.5px"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 12px 32px rgba(255, 165, 0, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 8px 24px rgba(255, 165, 0, 0.4)";
                        }}
                    >
                        REGISTER
                    </button>

                    {/* Message */}
                    {message && (
                        <div style={{
                            padding: "14px",
                            borderRadius: "10px",
                            background: message.includes("✓")
                                ? "rgba(76, 175, 80, 0.2)"
                                : "rgba(244, 67, 54, 0.2)",
                            border: `1px solid ${message.includes("✓") ? "#4CAF50" : "#f44336"}`,
                            color: "white",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}>
                            {message}
                        </div>
                    )}

                    {/* Social Login */}
                    <div style={{ textAlign: "center", margin: "20px 0" }}>
                        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", marginBottom: "16px" }}>
                            or Register Using
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                            <button type="button" style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                background: "#3b5998",
                                border: "none",
                                color: "white",
                                fontSize: "20px",
                                cursor: "pointer",
                                transition: "transform 0.3s"
                            }}
                                    onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                            >
                                f
                            </button>
                            <button type="button" style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                background: "white",
                                border: "none",
                                color: "#4285F4",
                                fontSize: "20px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "transform 0.3s"
                            }}
                                    onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                            >
                                G
                            </button>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px" }}>
                            Already have an account?{" "}
                            <Link to="/login" style={{
                                color: "#FFA500",
                                fontWeight: "700",
                                textDecoration: "none"
                            }}>
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* Add animation keyframes */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
}
