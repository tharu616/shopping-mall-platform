import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Payments() {
    const { role } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPayments();
    }, [role]);

    function fetchPayments() {
        setLoading(true);
        const endpoint = role === "ADMIN" ? "/payments/pending" : "/payments/mine";

        API.get(endpoint)
            .then(res => setPayments(res.data))
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Failed to load payments.");
            })
            .finally(() => setLoading(false));
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'VERIFIED': return 'green';
            case 'REJECTED': return 'red';
            case 'PENDING': return 'orange';
            default: return 'gray';
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            <h2>{role === "ADMIN" ? "Pending Payments" : "My Payments"}</h2>

            {role === "CUSTOMER" && (
                <Link to="/payments/upload">
                    <button style={{
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginBottom: "20px"
                    }}>
                        Upload New Payment
                    </button>
                </Link>
            )}

            {payments.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Order ID</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Reference</th>
                        <th style={{ padding: "12px", textAlign: "right" }}>Amount</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                        {role === "CUSTOMER" && <th style={{ padding: "12px", textAlign: "left" }}>Admin Note</th>}
                        <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "12px" }}>{payment.id}</td>
                            <td style={{ padding: "12px" }}>
                                <Link to={`/orders/${payment.orderId}`}>#{payment.orderId}</Link>
                            </td>
                            <td style={{ padding: "12px" }}><b>{payment.reference}</b></td>
                            <td style={{ padding: "12px", textAlign: "right" }}>${payment.amount}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                                    <span style={{
                                        padding: "4px 12px",
                                        borderRadius: "12px",
                                        backgroundColor: getStatusColor(payment.status) + "20",
                                        color: getStatusColor(payment.status),
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>
                                        {payment.status}
                                    </span>
                            </td>
                            {role === "CUSTOMER" && (
                                <td style={{ padding: "12px", fontSize: "14px", color: "#666" }}>
                                    {payment.adminNote || "-"}
                                </td>
                            )}
                            <td style={{ padding: "12px", textAlign: "center" }}>
                                {role === "ADMIN" && payment.status === "PENDING" ? (
                                    <Link to={`/payments/${payment.id}`}>
                                        <button style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}>
                                            Review
                                        </button>
                                    </Link>
                                ) : (
                                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                                        <button style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#6c757d",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}>
                                            View Receipt
                                        </button>
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
