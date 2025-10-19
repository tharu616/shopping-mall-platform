import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function UploadPayment() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        orderId: "",
        amount: "",
        reference: "",
        receiptUrl: ""
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch user's orders to select from
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        // Validation
        if (!formData.orderId || !formData.amount || !formData.reference || !formData.receiptUrl) {
            setMsg("All fields are required.");
            setLoading(false);
            return;
        }

        try {
            await API.post("/payments/upload", {
                orderId: parseInt(formData.orderId),
                amount: parseFloat(formData.amount),
                reference: formData.reference.trim(),
                receiptUrl: formData.receiptUrl.trim()
            });

            setMsg("Payment uploaded successfully!");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) {
            console.error("Upload error:", err);
            const errorMsg = err.response?.data?.message || "Failed to upload payment.";
            setMsg(errorMsg);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Upload Payment Receipt</h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label><b>Select Order:</b></label>
                    <select
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                        <option value="">-- Select an Order --</option>
                        {orders.map(order => (
                            <option key={order.id} value={order.id}>
                                Order #{order.id} - ${order.total} ({order.status})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label><b>Amount Paid:</b></label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="e.g., 1095.00"
                        step="0.01"
                        required
                        style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div>
                    <label><b>Payment Reference / Transaction ID:</b></label>
                    <input
                        type="text"
                        name="reference"
                        value={formData.reference}
                        onChange={handleChange}
                        placeholder="e.g., TXN123456789"
                        required
                        style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <small style={{ color: "#666" }}>Enter your bank transfer reference or transaction ID</small>
                </div>

                <div>
                    <label><b>Receipt URL (Image/PDF Link):</b></label>
                    <input
                        type="url"
                        name="receiptUrl"
                        value={formData.receiptUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/receipt.jpg"
                        required
                        style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <small style={{ color: "#666" }}>Upload your receipt to a cloud service (e.g., Google Drive, Imgur) and paste the link here</small>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "12px",
                        backgroundColor: loading ? "#ccc" : "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}
                >
                    {loading ? "Uploading..." : "Upload Payment"}
                </button>

                {msg && (
                    <div style={{
                        padding: "12px",
                        backgroundColor: msg.includes("success") ? "#d4edda" : "#f8d7da",
                        color: msg.includes("success") ? "#155724" : "#721c24",
                        borderRadius: "5px",
                        fontWeight: "bold"
                    }}>
                        {msg}
                    </div>
                )}
            </form>

            <button
                onClick={() => navigate("/payments")}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Cancel
            </button>
        </div>
    );
}
