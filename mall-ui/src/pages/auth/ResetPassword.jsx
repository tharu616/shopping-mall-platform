import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(null);

    useEffect(() => {
        // Verify token on mount
        API.get(`/auth/verify-reset-token/${token}`)
            .then(res => setValidToken(res.data.valid))
            .catch(() => setValidToken(false));
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await API.post("/auth/reset-password", {
                token,
                newPassword
            });
            setMessage("✓ Password reset successfully!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to reset password");
        }
        setLoading(false);
    };

    if (validToken === null) {
        return <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)",
            color: "white",
            fontSize: "18px"
        }}>Verifying token...</div>;
    }

    if (validToken === false) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)"
            }}>
                <div style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "40px",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>⚠️</div>
                    <h2 style={{ color: "#dc3545" }}>Invalid or Expired Token</h2>
                    <p style={{ color: "#666", margin: "20px 0" }}>
                        This reset link is invalid or has expired
                    </p>
                    <Link to="/forgot-password">
                        <button style={{
                            padding: "12px 24px",
                            background: "#1E90FF",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "700"
                        }}>
                            Request New Link
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

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
                width: "100%"
            }}>
                <h1 style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "#1A1A2E",
                    textAlign: "center",
                    marginBottom: "10px"
                }}>
                    🔐 Reset Password
                </h1>
                <p style={{
                    textAlign: "center",
                    color: "#666",
                    marginBottom: "30px",
                    fontSize: "15px"
                }}>
                    Enter your new password
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "8px",
                            fontSize: "14px"
                        }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
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

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "8px",
                            fontSize: "14px"
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
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
                            background: loading ? "#ccc" : "linear-gradient(135deg, #4CAF50, #45a049)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginBottom: "16px"
                        }}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    {message && (
                        <div style={{
                            padding: "12px",
                            background: message.includes("✓") ? "rgba(76,175,80,0.1)" : "rgba(220,53,69,0.1)",
                            color: message.includes("✓") ? "#4CAF50" : "#dc3545",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: "600",
                            textAlign: "center"
                        }}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
