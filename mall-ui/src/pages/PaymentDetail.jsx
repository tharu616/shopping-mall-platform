import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function PaymentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [actionMsg, setActionMsg] = useState("");

    useEffect(() => {
        fetchPayment();
    }, [id]);

    function fetchPayment() {
        API.get(`/payments/${id}`)
            .then(res => setPayment(res.data))
            .catch(() => setError("Payment not found."))
            .finally(() => setLoading(false));
    }

    const handleApprove = async () => {
        setActionMsg("");
        try {
            await API.patch(`/payments/${id}/approve`, { adminNote });
            setActionMsg("Payment approved successfully!");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) {
            setActionMsg(err.response?.data?.message || "Failed to approve payment.");
        }
    };

    const handleReject = async () => {
        if (!adminNote.trim()) {
            setActionMsg("Please provide a reason for rejection.");
            return;
        }

        setActionMsg("");
        try {
            await API.patch(`/payments/${id}/reject`, { adminNote });
            setActionMsg("Payment rejected.");
            setTimeout(() => navigate("/payments"), 1500);
        } catch (err) {
            setActionMsg(err.response?.data?.message || "Failed to reject payment.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!payment) return null;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Payment Review #{payment.id}</h2>

            <div style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px"
            }}>
                <p><b>Order ID:</b> <Link to={`/orders/${payment.orderId}`}>#{payment.orderId}</Link></p>
                <p><b>User Email:</b> {payment.userEmail}</p>
                <p><b>Amount:</b> ${payment.amount}</p>
                <p><b>Reference:</b> {payment.reference}</p>
                <p><b>Status:</b> <span style={{
                    color: payment.status === 'VERIFIED' ? 'green' :
                        payment.status === 'REJECTED' ? 'red' : 'orange',
                    fontWeight: 'bold'
                }}>{payment.status}</span></p>
                {payment.adminNote && <p><b>Admin Note:</b> {payment.adminNote}</p>}
            </div>

            <h3>Receipt:</h3>
            <div style={{
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "20px",
                textAlign: "center"
            }}>
                {payment.receiptUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                        src={payment.receiptUrl}
                        alt="Payment Receipt"
                        style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "5px" }}
                    />
                ) : (
                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                        <button style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}>
                            View Receipt (PDF/Document)
                        </button>
                    </a>
                )}
            </div>

            {payment.status === "PENDING" && (
                <div style={{
                    border: "2px solid #4CAF50",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "#f9fff9"
                }}>
                    <h3>Admin Review</h3>
                    <label>
                        <b>Admin Note (Optional for Approve, Required for Reject):</b>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows="3"
                            placeholder="Add a note for the customer..."
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </label>

                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                        <button
                            onClick={handleApprove}
                            style={{
                                flex: 1,
                                padding: "12px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "bold"
                            }}
                        >
                            ✓ Approve Payment
                        </button>
                        <button
                            onClick={handleReject}
                            style={{
                                flex: 1,
                                padding: "12px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "bold"
                            }}
                        >
                            ✗ Reject Payment
                        </button>
                    </div>

                    {actionMsg && (
                        <div style={{
                            marginTop: "15px",
                            padding: "12px",
                            backgroundColor: actionMsg.includes("success") || actionMsg.includes("approved") ? "#d4edda" : "#f8d7da",
                            color: actionMsg.includes("success") || actionMsg.includes("approved") ? "#155724" : "#721c24",
                            borderRadius: "5px",
                            fontWeight: "bold"
                        }}>
                            {actionMsg}
                        </div>
                    )}
                </div>
            )}

            {payment.status !== "PENDING" && (
                <div style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffc107",
                    borderRadius: "5px",
                    color: "#856404"
                }}>
                    <b>This payment has already been {payment.status.toLowerCase()}.</b>
                </div>
            )}

            <br />
            <Link to="/payments" style={{ color: "#007bff", fontWeight: "bold", fontSize: "16px" }}>
                ← Back to Payments
            </Link>
        </div>
    );
}
