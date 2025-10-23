import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../AuthContext";

export default function Profile() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [uploadingPicture, setUploadingPicture] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await API.get("/users/me");
                setUser(res.data);
                setFullName(res.data.fullName);
            } catch (err) {
                setMsg("Not logged in");
                logout();
            }
        }
        fetchProfile();
    }, [logout]);

    async function handleUpdate(e) {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            await API.put("/users/me", { fullName: fullName.trim() });
            setMsg("✓ Profile updated successfully!");
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("Failed to update profile");
        }
        setLoading(false);
    }

    // ✅ SIMPLE DELETE with window.confirm()
    async function handleDeleteAccount() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this account?\n\nThis action is permanent and cannot be undone. All your data, orders, and information will be permanently deleted."
        );

        if (!confirmed) return;

        try {
            await API.delete("/users/me");
            setMsg("✓ Account deleted successfully");
            setTimeout(() => {
                logout();
                navigate("/login");
            }, 1500);
        } catch (err) {
            setMsg("Failed to delete account");
        }
    }

    const getRoleBadgeStyle = (role) => {
        const styles = {
            ADMIN: { bg: "linear-gradient(135deg, #dc3545, #c82333)", icon: "👑" },
            VENDOR: { bg: "linear-gradient(135deg, #4B368B, #2E2566)", icon: "🏪" },
            CUSTOMER: { bg: "linear-gradient(135deg, #1E90FF, #4B368B)", icon: "👤" }
        };
        return styles[role] || styles.CUSTOMER;
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePictureUpload = async () => {
        if (!profilePicture) return;

        setUploadingPicture(true);
        const formData = new FormData();
        formData.append('file', profilePicture);

        try {
            const res = await API.post('/users/me/upload-profile-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data);
            setMsg('✓ Profile picture updated!');
            setProfilePicture(null);
            setProfilePicturePreview(null);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to upload profile picture');
        }
        setUploadingPicture(false);
    };

    const handleProfilePictureDelete = async () => {
        try {
            await API.delete('/users/me/profile-picture');
            setUser({ ...user, profilePictureUrl: null });
            setMsg('✓ Profile picture removed');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Failed to delete profile picture');
        }
    };

    if (!user) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E90FF 0%, #4B368B 100%)"
            }}>
                <div style={{ color: "white", fontSize: "24px", fontWeight: "600" }}>
                    Loading profile...
                </div>
            </div>
        );
    }

    const roleStyle = getRoleBadgeStyle(user.role);

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h1 style={{
                        fontSize: "42px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        👤 My Profile
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Profile Card - Glassmorphism */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    marginBottom: "24px"
                }}>
                    {/* Avatar Section */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '30px'
                    }}>
                        {/* Profile Picture Upload */}
                        <div style={{
                            position: 'relative',
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 20px'
                        }}>
                            {user.profilePictureUrl || profilePicturePreview ? (
                                <img
                                    src={profilePicturePreview || `http://localhost:8081${user.profilePictureUrl}`}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: roleStyle.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '60px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                                }}>
                                    {roleStyle.icon}
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                id="profile-picture-input"
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }}
                            />

                            <label
                                htmlFor="profile-picture-input"
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: '#1E90FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                    color: 'white',
                                    fontSize: '18px'
                                }}
                            >
                                📷
                            </label>
                        </div>

                        {profilePicture && (
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={handleProfilePictureUpload}
                                    disabled={uploadingPicture}
                                    style={{
                                        padding: '10px 20px',
                                        background: uploadingPicture ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #45a049)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        marginRight: '10px',
                                        cursor: uploadingPicture ? 'not-allowed' : 'pointer',
                                        fontWeight: '700'
                                    }}
                                >
                                    {uploadingPicture ? 'Uploading...' : '✓ Upload Picture'}
                                </button>
                                <button
                                    onClick={() => {
                                        setProfilePicture(null);
                                        setProfilePicturePreview(null);
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: '700'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {user.profilePictureUrl && !profilePicture && (
                            <button
                                onClick={handleProfilePictureDelete}
                                style={{
                                    padding: '8px 16px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    marginBottom: '20px'
                                }}
                            >
                                🗑️ Remove Picture
                            </button>
                        )}

                        <h2 style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            color: "#1A1A2E",
                            marginBottom: "8px"
                        }}>
                            {user.fullName || "User"}
                        </h2>
                        <div style={{
                            display: "inline-block",
                            padding: "8px 20px",
                            background: roleStyle.bg,
                            borderRadius: "20px",
                            color: "white",
                            fontWeight: "700",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            letterSpacing: "1px"
                        }}>
                            {user.role}
                        </div>
                    </div>

                    {/* Account Info */}
                    <div style={{
                        padding: "24px",
                        background: "linear-gradient(135deg, rgba(30,144,255,0.05), rgba(75,54,139,0.05))",
                        borderRadius: "16px",
                        marginBottom: "30px",
                        border: "1px solid rgba(30,144,255,0.1)"
                    }}>
                        <h3 style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "16px"
                        }}>
                            📧 Account Information
                        </h3>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            gap: "12px",
                            fontSize: "15px"
                        }}>
                            <span style={{ color: "#666", fontWeight: "600" }}>Email:</span>
                            <span style={{ color: "#1A1A2E", fontWeight: "700" }}>{user.email}</span>

                            <span style={{ color: "#666", fontWeight: "600" }}>User ID:</span>
                            <span style={{ color: "#1A1A2E", fontWeight: "700" }}>#{user.id}</span>
                        </div>
                    </div>

                    {/* Update Profile Form */}
                    <form onSubmit={handleUpdate}>
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "700",
                                color: "#1A1A2E",
                                marginBottom: "10px",
                                fontSize: "15px"
                            }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                style={{
                                    width: "100%",
                                    padding: "14px 18px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(30,144,255,0.3)",
                                    background: "rgba(255,255,255,0.9)",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1A1A2E",
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
                                background: loading
                                    ? "#ccc"
                                    : "linear-gradient(135deg, #4CAF50, #45a049)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "18px",
                                fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "0 8px 24px rgba(76,175,80,0.4)",
                                transition: "all 0.3s"
                            }}
                        >
                            {loading ? "⏳ Updating..." : "✓ Update Profile"}
                        </button>
                    </form>

                    {/* Message */}
                    {msg && (
                        <div style={{
                            marginTop: "20px",
                            padding: "16px 20px",
                            borderRadius: "12px",
                            background: msg.includes("✓")
                                ? "rgba(76,175,80,0.15)"
                                : "rgba(220,53,69,0.15)",
                            color: msg.includes("✓") ? "#4CAF50" : "#dc3545",
                            fontWeight: "700",
                            fontSize: "15px",
                            border: `2px solid ${msg.includes("✓") ? "#4CAF50" : "#dc3545"}`
                        }}>
                            {msg}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "24px"
                }}>
                    <button
                        onClick={logout}
                        style={{
                            padding: "16px",
                            background: "linear-gradient(135deg, #FFA500, #FF8C00)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(255,165,0,0.3)",
                            transition: "all 0.3s"
                        }}
                    >
                        🚪 Logout
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        style={{
                            padding: "16px",
                            background: "linear-gradient(135deg, #dc3545, #c82333)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(220,53,69,0.3)",
                            transition: "all 0.3s"
                        }}
                    >
                        🗑️ Delete Account
                    </button>
                </div>

                {/* Info Card */}
                <div style={{
                    padding: "20px",
                    background: "rgba(30,144,255,0.05)",
                    borderRadius: "16px",
                    border: "1px solid rgba(30,144,255,0.2)"
                }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "24px" }}>💡</span>
                        <div>
                            <h4 style={{ color: "#1A1A2E", marginBottom: "8px", fontSize: "14px", fontWeight: "700" }}>
                                Account Security
                            </h4>
                            <ul style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", margin: 0, paddingLeft: "20px" }}>
                                <li>Keep your email address up to date</li>
                                <li>Never share your password with anyone</li>
                                <li>Use the logout button when using shared devices</li>
                                <li>Account deletion is permanent and cannot be reversed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
