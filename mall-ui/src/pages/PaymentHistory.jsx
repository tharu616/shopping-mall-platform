import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "",
        startDate: "",
        endDate: "",
        userEmail: ""
    });
    const [summary, setSummary] = useState({
        total: 0,
        verified: 0,
        pending: 0,
        rejected: 0,
        totalAmount: 0,
        verifiedAmount: 0
    });


    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    function fetchPaymentHistory() {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.userEmail) params.append("userEmail", filters.userEmail);

        API.get(`/payments/history?${params.toString()}`)
            .then(res => {
                setPayments(res.data);
                calculateSummary(res.data);
            })
            .catch(err => console.error("Failed to fetch payment history", err))
            .finally(() => setLoading(false));
    }

    function calculateSummary(data) {
        const total = data.length;
        const verified = data.filter(p => p.status === "VERIFIED").length;
        const pending = data.filter(p => p.status === "PENDING").length;
        const rejected = data.filter(p => p.status === "REJECTED").length;
        const totalAmount = data.reduce((sum, p) => sum + p.amount, 0);
        const verifiedAmount = data
            .filter(p => p.status === "VERIFIED")
            .reduce((sum, p) => sum + p.amount, 0);

        setSummary({ total, verified, pending, rejected, totalAmount, verifiedAmount });
    }

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApplyFilters = () => {
        fetchPaymentHistory();
    };

    const handleClearFilters = () => {
        setFilters({ status: "", startDate: "", endDate: "", userEmail: "" });
        setTimeout(() => fetchPaymentHistory(), 100);
    };

    const downloadCSV = () => {
        const headers = ["Payment ID", "Order ID", "User Email", "Amount", "Status", "Reference"];
        const csvData = [
            headers.join(","),
            ...payments.map(p =>
                `${p.id},${p.orderId},${p.userEmail},$${p.amount},${p.status},${p.reference || "N/A"}`
            )
        ].join("\n");

        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const downloadPDF = () => {
        // For PDF generation, you can use jsPDF library
        alert("PDF generation feature coming soon! For now, use CSV export.");
    };

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)"
            }}>
                <div style={{ color: "#666", fontSize: "20px", fontWeight: "700" }}>
                    ⏳ Loading payment history...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8ebf0 100%)",
            padding: "60px 20px"
        }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "30px" }}>
                    <h1 style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#1A1A2E",
                        marginBottom: "8px"
                    }}>
                        📊 Payment History & Reports
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        View, filter, and export payment transaction history
                    </p>
                </div>

                {/* Summary Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px"
                }}>
                    <SummaryCard label="Total Payments" value={summary.total} color="#1E90FF" />
                    <SummaryCard label="Verified" value={summary.verified} color="#4CAF50" />
                    <SummaryCard label="Pending" value={summary.pending} color="#FFA500" />
                    <SummaryCard label="Rejected" value={summary.rejected} color="#dc3545" />
                    <SummaryCard label="Total Amount" value={`$${summary.totalAmount.toFixed(2)}`} color="#9C27B0" />
                    <SummaryCard label="Verified Amount" value={`$${summary.verifiedAmount.toFixed(2)}`} color="#4CAF50" />
                </div>

                {/* Filters */}
                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "24px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
                }}>
                    <h3 style={{ marginBottom: "16px", fontWeight: "700" }}>Filters</h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        marginBottom: "16px"
                    }}>
                        <input
                            type="text"
                            name="userEmail"
                            placeholder="Search by email"
                            value={filters.userEmail}
                            onChange={handleFilterChange}
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                fontSize: "14px"
                            }}
                        />
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                fontSize: "14px"
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                fontSize: "14px"
                            }}
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                fontSize: "14px"
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            onClick={handleApplyFilters}
                            style={{
                                padding: "12px 24px",
                                background: "#1E90FF",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "700"
                            }}
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={handleClearFilters}
                            style={{
                                padding: "12px 24px",
                                background: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "700"
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Export Buttons */}
                <div style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "24px"
                }}>
                    <button
                        onClick={downloadCSV}
                        style={{
                            padding: "12px 24px",
                            background: "linear-gradient(135deg, #4CAF50, #45a049)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        📥 Export CSV
                    </button>
                    <button
                        onClick={downloadPDF}
                        style={{
                            padding: "12px 24px",
                            background: "linear-gradient(135deg, #dc3545, #c82333)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        📄 Export PDF
                    </button>
                </div>

                {/* Payment Table */}
                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    overflowX: "auto"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ borderBottom: "2px solid #eee" }}>
                            <th style={{ padding: "16px", textAlign: "left", fontWeight: "700" }}>ID</th>
                            <th style={{ padding: "16px", textAlign: "left", fontWeight: "700" }}>Order ID</th>
                            <th style={{ padding: "16px", textAlign: "left", fontWeight: "700" }}>User Email</th>
                            <th style={{ padding: "16px", textAlign: "right", fontWeight: "700" }}>Amount</th>
                            <th style={{ padding: "16px", textAlign: "center", fontWeight: "700" }}>Status</th>
                            <th style={{ padding: "16px", textAlign: "left", fontWeight: "700" }}>Reference</th>
                            <th style={{ padding: "16px", textAlign: "center", fontWeight: "700" }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payments.map(payment => (
                            <tr key={payment.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                <td style={{ padding: "16px" }}>{payment.id}</td>
                                <td style={{ padding: "16px" }}>
                                    <Link to={`/orders/${payment.orderId}`} style={{ color: "#1E90FF", textDecoration: "none" }}>
                                        #{payment.orderId}
                                    </Link>
                                </td>
                                <td style={{ padding: "16px" }}>{payment.userEmail}</td>
                                <td style={{ padding: "16px", textAlign: "right", fontWeight: "700" }}>
                                    ${payment.amount.toFixed(2)}
                                </td>
                                <td style={{ padding: "16px", textAlign: "center" }}>
                                        <span style={{
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            background: payment.status === "VERIFIED" ? "#d4edda" :
                                                payment.status === "PENDING" ? "#fff3cd" : "#f8d7da",
                                            color: payment.status === "VERIFIED" ? "#155724" :
                                                payment.status === "PENDING" ? "#856404" : "#721c24"
                                        }}>
                                            {payment.status}
                                        </span>
                                </td>
                                <td style={{ padding: "16px" }}>{payment.reference || "N/A"}</td>
                                <td style={{ padding: "16px", textAlign: "center" }}>
                                    <Link
                                        to={`/payments/${payment.id}`}
                                        style={{
                                            padding: "8px 16px",
                                            background: "#1E90FF",
                                            color: "white",
                                            textDecoration: "none",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {payments.length === 0 && (
                        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                            No payment records found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const SummaryCard = ({ label, value, color }) => (
    <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>{label}</div>
        <div style={{ fontSize: "24px", fontWeight: "800", color }}>{value}</div>
    </div>
);
