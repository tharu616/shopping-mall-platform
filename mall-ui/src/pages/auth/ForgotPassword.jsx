import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            await API.post("/auth/forgot-password", { email });
            setSuccess(true);
            setMessage("✓ Password reset link sent to your email!");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to send reset link");
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }}>
            <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                padding: "40px",
                maxWidth: "450px",
                width: "100%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
                <h1 style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "#1A1A2E",
                    textAlign: "center",
                    marginBottom: "10px"
                }}>
                    🔑 Forgot Password?
                </h1>
                <p style={{
                    textAlign: "center",
                    color: "#666",
                    marginBottom: "30px",
                    fontSize: "15px"
                }}>
                    Enter your email to receive a password reset link
                </p>

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                color: "#1A1A2E",
                                marginBottom: "8px",
                                fontSize: "14px"
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                                style={{
                                    width: "100%",
                                    padding: "14px 18px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(30,144,255,0.3)",
                                    fontSize: "15px",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: loading ? "#ccc" : "linear-gradient(135deg, #1E90FF, #4B368B)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer",
                                marginBottom: "16px"
                            }}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        {message && !success && (
                            <div style={{
                                padding: "12px",
                                background: "rgba(220,53,69,0.1)",
                                color: "#dc3545",
                                borderRadius: "10px",
                                marginBottom: "16px",
                                fontSize: "14px",
                                fontWeight: "600",
                                textAlign: "center"
                            }}>
                                {message}
                            </div>
                        )}

                        <div style={{ textAlign: "center" }}>
                            <Link to="/login" style={{
                                color: "#1E90FF",
                                textDecoration: "none",
                                fontWeight: "600",
                                fontSize: "14px"
                            }}>
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            fontSize: "64px",
                            marginBottom: "20px"
                        }}>
                            ✅
                        </div>
                        <div style={{
                            padding: "16px",
                            background: "rgba(76,175,80,0.1)",
                            color: "#4CAF50",
                            borderRadius: "12px",
                            marginBottom: "20px",
                            fontWeight: "600"
                        }}>
                            {message}
                        </div>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                            Check your email inbox and click the reset link
                        </p>
                        <Link to="/login">
                            <button style={{
                                padding: "12px 24px",
                                background: "#1E90FF",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontWeight: "700"
                            }}>
                                Return to Login
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
