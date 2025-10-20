import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import API from "../../api";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await API.post("/auth/login", form);
            login(res.data.token, res.data.role);
            navigate("/dashboard");
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #2E2566 0%, #4B368B 50%, #1E90FF 100%)",
            position: "relative",
            overflow: "hidden",
            padding: "40px 20px"
        }}>
            {/* Animated Background */}
            <div style={{
                position: "absolute",
                top: "10%",
                left: "-5%",
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(255,165,0,0.25), transparent 70%)",
                borderRadius: "50%",
                filter: "blur(70px)",
                animation: "float 7s ease-in-out infinite"
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
                maxWidth: "450px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                position: "relative",
                zIndex: 1
            }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "white",
                        marginBottom: "8px"
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "16px" }}>
                        Login to continue shopping
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
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
                                outline: "none"
                            }}
                        />
                    </div>

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
                            placeholder="Enter your password"
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
                                outline: "none"
                            }}
                        />
                    </div>
                    {/* Add this after the password input */}
                    <div style={{ textAlign: "right", marginBottom: "20px" }}>
                        <Link to="/forgot-password" style={{
                            color: "#1E90FF",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}>
                            Forgot Password?
                        </Link>
                    </div>


                    <button type="submit" style={{
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
                        transition: "all 0.3s"
                    }}>
                        LOGIN
                    </button>

                    {message && (
                        <div style={{
                            padding: "14px",
                            borderRadius: "10px",
                            background: "rgba(244, 67, 54, 0.2)",
                            border: "1px solid #f44336",
                            color: "white",
                            textAlign: "center",
                            fontSize: "14px"
                        }}>
                            {message}
                        </div>
                    )}

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px" }}>
                            Don't have an account?{" "}
                            <Link to="/register" style={{
                                color: "#FFA500",
                                fontWeight: "700",
                                textDecoration: "none"
                            }}>
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                input::placeholder { color: rgba(255, 255, 255, 0.5); }
            `}</style>
        </div>
    );
}
