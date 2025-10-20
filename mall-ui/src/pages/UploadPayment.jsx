import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function UploadPayment() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        orderId: "",
        amount: "",
        reference: "",
        receiptUrl: "",
        paymentMethod: "" // This is the key field
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const paymentMethods = [
        { id: "card", name: "Credit/Debit Card", icon: "💳" },
        { id: "bank_transfer", name: "Bank Transfer", icon: "🏦" },
        { id: "paypal", name: "PayPal", icon: "💰" },
        { id: "cash_on_delivery", name: "Cash on Delivery", icon: "💵" }
    ];

    useEffect(() => {
        API.get("/orders")
            .then(res => setOrders(res.data))
            .catch(() => setMsg("Failed to load orders."));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // **FIX: Separate handler for payment method selection**
    const handlePaymentMethodSelect = (methodId) => {
        setFormData({
            ...formData,
            paymentMethod: methodId
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Create preview for images
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        // Validation
        if (!formData.orderId || !formData.amount || !formData.reference || !formData.paymentMethod) {
            setMsg("All fields including payment method are required.");
            setLoading(false);
            return;
        }

        if (!formData.receiptUrl && !file) {
            setMsg("Please provide a receipt URL or upload a file.");
            setLoading(false);
            return;
        }

        try {
            // In a real app, you would upload the file to a cloud service here
            const receiptUrl = formData.receiptUrl || (file ? `uploaded_${file.name}` : "");

            await API.post("/payments/upload", {
                orderId: parseInt(formData.orderId),
                amount: parseFloat(formData.amount),
                reference: formData.reference.trim(),
                receiptUrl: receiptUrl,
                paymentMethod: formData.paymentMethod
            });

            setMsg("✓ Payment uploaded successfully!");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) {
            console.error("Upload error:", err);
            const errorMsg = err.response?.data?.message || "Failed to upload payment.";
            setMsg(errorMsg);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: "30px" }}>
                    <Link to="/payments" style={{
                        color: "#1E90FF",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        ← Back to Payments
                    </Link>
                </div>

                {/* Header */}
                <div style={{ marginBottom: "30px" }}>
                    <h1 style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        💳 Upload Payment Receipt
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        Submit your payment proof for order verification
                    </p>
                </div>

                {/* Form - Glassmorphism */}
                <form onSubmit={handleSubmit} style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}>
                    {/* Select Order */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "10px",
                            fontSize: "15px"
                        }}>
                            Select Order <span style={{ color: "#dc3545" }}>*</span>
                        </label>
                        <select
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                border: "2px solid rgba(30,144,255,0.3)",
                                background: "rgba(255,255,255,0.9)",
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "#1A1A2E",
                                cursor: "pointer",
                                outline: "none"
                            }}
                        >
                            <option value="">-- Select an Order --</option>
                            {orders.map(order => (
                                <option key={order.id} value={order.id}>
                                    Order #{order.id} - ${order.total} ({order.status})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method Selection - FIXED */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "12px",
                            fontSize: "15px"
                        }}>
                            Payment Method <span style={{ color: "#dc3545" }}>*</span>
                        </label>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "12px"
                        }}>
                            {paymentMethods.map(method => {
                                const isSelected = formData.paymentMethod === method.id;
                                return (
                                    <div
                                        key={method.id}
                                        onClick={() => handlePaymentMethodSelect(method.id)}
                                        style={{
                                            padding: "18px 16px",
                                            borderRadius: "14px",
                                            border: isSelected
                                                ? "3px solid #1E90FF"
                                                : "2px solid rgba(30,144,255,0.2)",
                                            background: isSelected
                                                ? "linear-gradient(135deg, rgba(30,144,255,0.15), rgba(75,54,139,0.15))"
                                                : "rgba(255,255,255,0.7)",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            transition: "all 0.3s ease",
                                            backdropFilter: "blur(10px)",
                                            boxShadow: isSelected ? "0 4px 15px rgba(30,144,255,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
                                            transform: isSelected ? "scale(1.05)" : "scale(1)",
                                            userSelect: "none"
                                        }}
                                    >
                                        <div style={{ fontSize: "36px", marginBottom: "10px" }}>
                                            {method.icon}
                                        </div>
                                        <div style={{
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            color: isSelected ? "#1E90FF" : "#666",
                                            lineHeight: "1.3"
                                        }}>
                                            {method.name}
                                        </div>
                                        {isSelected && (
                                            <div style={{
                                                marginTop: "8px",
                                                fontSize: "18px",
                                                color: "#4CAF50"
                                            }}>
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {formData.paymentMethod && (
                            <small style={{
                                display: "block",
                                marginTop: "10px",
                                color: "#4CAF50",
                                fontWeight: "600",
                                fontSize: "13px"
                            }}>
                                ✓ Selected: {paymentMethods.find(m => m.id === formData.paymentMethod)?.name}
                            </small>
                        )}
                    </div>

                    {/* Amount Paid */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "10px",
                            fontSize: "15px"
                        }}>
                            Amount Paid <span style={{ color: "#dc3545" }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="e.g., 1095.00"
                            step="0.01"
                            required
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

                    {/* Payment Reference */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "10px",
                            fontSize: "15px"
                        }}>
                            Payment Reference / Transaction ID <span style={{ color: "#dc3545" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            placeholder="e.g., TXN123456789"
                            required
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                border: "2px solid rgba(30,144,255,0.3)",
                                background: "rgba(255,255,255,0.9)",
                                fontSize: "15px",
                                color: "#1A1A2E",
                                outline: "none"
                            }}
                        />
                        <small style={{ color: "#666", fontSize: "13px", marginTop: "6px", display: "block" }}>
                            Enter your bank transfer reference or transaction ID
                        </small>
                    </div>

                    {/* Receipt Upload Options */}
                    <div style={{
                        padding: "24px",
                        background: "linear-gradient(135deg, rgba(30,144,255,0.05), rgba(75,54,139,0.05))",
                        borderRadius: "16px",
                        border: "2px dashed rgba(30,144,255,0.3)",
                        marginBottom: "24px"
                    }}>
                        <h3 style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#1A1A2E",
                            marginBottom: "16px"
                        }}>
                            📄 Upload Receipt (Choose one option)
                        </h3>

                        {/* File Upload */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#666",
                                marginBottom: "10px",
                                fontSize: "14px"
                            }}>
                                Option 1: Upload File (Image/PDF)
                            </label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "2px solid rgba(30,144,255,0.3)",
                                    background: "rgba(255,255,255,0.9)",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                            />
                            {filePreview && (
                                <div style={{ marginTop: "12px", textAlign: "center" }}>
                                    <img
                                        src={filePreview}
                                        alt="Receipt preview"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "200px",
                                            borderRadius: "10px",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                                        }}
                                    />
                                    <p style={{ marginTop: "8px", color: "#4CAF50", fontWeight: "600", fontSize: "13px" }}>
                                        ✓ File selected: {file?.name}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={{
                            textAlign: "center",
                            padding: "8px 0",
                            color: "#999",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}>
                            — OR —
                        </div>

                        {/* URL Input */}
                        <div>
                            <label style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#666",
                                marginBottom: "10px",
                                fontSize: "14px"
                            }}>
                                Option 2: Paste Receipt URL
                            </label>
                            <input
                                type="url"
                                name="receiptUrl"
                                value={formData.receiptUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/receipt.jpg"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "2px solid rgba(30,144,255,0.3)",
                                    background: "rgba(255,255,255,0.9)",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            />
                            <small style={{ color: "#666", fontSize: "12px", marginTop: "6px", display: "block" }}>
                                Upload to Google Drive, Imgur, etc., and paste the link here
                            </small>
                        </div>
                    </div>

                    {/* Submit Button */}
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
                            transition: "all 0.3s",
                            marginBottom: "16px"
                        }}
                    >
                        {loading ? "⏳ Uploading..." : "✓ Upload Payment"}
                    </button>

                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={() => navigate("/payments")}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "transparent",
                            color: "#6c757d",
                            border: "2px solid #6c757d",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.3s"
                        }}
                    >
                        Cancel
                    </button>

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
                </form>

                {/* Info Card */}
                <div style={{
                    marginTop: "24px",
                    padding: "20px",
                    background: "rgba(30,144,255,0.05)",
                    borderRadius: "16px",
                    border: "1px solid rgba(30,144,255,0.2)"
                }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "24px" }}>ℹ️</span>
                        <div>
                            <h4 style={{ color: "#1A1A2E", marginBottom: "8px", fontSize: "14px", fontWeight: "700" }}>
                                Important Information
                            </h4>
                            <ul style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", margin: 0, paddingLeft: "20px" }}>
                                <li>Your payment will be reviewed by admin within 24-48 hours</li>
                                <li>Ensure the receipt clearly shows the transaction amount and reference</li>
                                <li>Accepted file formats: JPG, PNG, PDF (max 5MB)</li>
                                <li>You'll receive a notification once your payment is verified</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
