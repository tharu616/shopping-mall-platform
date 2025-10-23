import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function UploadPayment() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [reference, setReference] = useState("");
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState("");

    // Card fields
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardExpiryDate, setCardExpiryDate] = useState("");
    const [cardCvv, setCardCvv] = useState("");

    // Bank fields
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [branchCode, setBranchCode] = useState("");
    const [transferDate, setTransferDate] = useState("");

    // PayPal fields
    const [paypalEmail, setPaypalEmail] = useState("");
    const [paypalTransactionId, setPaypalTransactionId] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoadingOrders(true);
        try {
            const res = await API.get("/orders/me");
            console.log("Orders API Response:", res.data); // ADD THIS FOR DEBUGGING

            // Filter out only DELIVERED and CANCELLED orders
            // PENDING, CONFIRMED, SHIPPED should all show
            const availableOrders = res.data.filter(o =>
                o.status !== "CANCELLED" && o.status !== "DELIVERED"
            );

            console.log("Filtered available orders:", availableOrders); // ADD THIS FOR DEBUGGING
            setOrders(availableOrders);

            if (availableOrders.length === 0) {
                setMessage("ℹ️ No orders available for payment");
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setMessage("❌ Failed to load orders: " + (err.response?.data?.message || err.message));
        } finally {
            setLoadingOrders(false);
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const payload = {
                orderId: parseInt(selectedOrder),
                paymentMethod,
                amount: parseFloat(amount),
                reference: reference || undefined,
                receiptUrl: receiptUrl || undefined,

                // Card fields
                ...(paymentMethod === "CARD" && {
                    cardNumber,
                    cardHolderName,
                    cardExpiryDate,
                    cardCvv
                }),

                // Bank fields
                ...(paymentMethod === "BANK_TRANSFER" && {
                    bankName,
                    accountNumber,
                    accountHolderName,
                    branchCode,
                    transferDate
                }),

                // PayPal fields
                ...(paymentMethod === "PAYPAL" && {
                    paypalEmail,
                    paypalTransactionId
                })
            };

            console.log("Submitting payment:", payload); // Debug log
            await API.post("/payments/upload", payload);
            setMessage("✓ Payment submitted successfully!");
            setTimeout(() => navigate("/payments"), 2000);
        } catch (err) {
            console.error("Payment error:", err);
            setMessage("❌ " + (err.response?.data?.message || "Failed to submit payment"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
            <button
                onClick={() => navigate("/payments")}
                style={{
                    background: "white",
                    border: "2px solid #e0e0e0",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "20px"
                }}
            >
                ← Back to Payments
            </button>

            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
                <h2 style={{ marginBottom: "10px" }}>💳 Upload Payment Receipt</h2>
                <p style={{ color: "#666", marginBottom: "30px" }}>
                    Submit your payment proof for order verification
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Select Order */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                            Select Order *
                        </label>
                        {loadingOrders ? (
                            <div style={{ padding: "12px", textAlign: "center", color: "#666" }}>
                                Loading orders...
                            </div>
                        ) : (
                            <select
                                value={selectedOrder}
                                onChange={(e) => {
                                    const orderId = e.target.value;
                                    setSelectedOrder(orderId);
                                    // Auto-fill amount from selected order
                                    const order = orders.find(o => o.id === parseInt(orderId));
                                    if (order && order.totalAmount) {
                                        setAmount(order.totalAmount.toString());
                                    }
                                }}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "2px solid #e0e0e0",
                                    borderRadius: "8px",
                                    fontSize: "16px"
                                }}
                            >
                                <option value="">-- Select an Order ({orders.length} available) --</option>
                                {orders.map(order => (
                                    <option key={order.id} value={order.id}>
                                        Order #{order.id} - ${(order.totalAmount || 0).toFixed(2)} - {order.status}
                                    </option>
                                ))}
                            </select>

                        )}
                        {orders.length === 0 && !loadingOrders && (
                            <small style={{ color: "#999", display: "block", marginTop: "5px" }}>
                                No orders available. Please place an order first.
                            </small>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "12px", fontWeight: "600" }}>
                            Payment Method *
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
                            {[
                                { value: "CARD", icon: "💳", label: "Credit/Debit Card" },
                                { value: "BANK_TRANSFER", icon: "🏦", label: "Bank Transfer" },
                                { value: "PAYPAL", icon: "💰", label: "PayPal" },
                                { value: "CASH_ON_DELIVERY", icon: "💵", label: "Cash on Delivery" }
                            ].map(method => (
                                <div
                                    key={method.value}
                                    onClick={() => setPaymentMethod(method.value)}
                                    style={{
                                        padding: "20px",
                                        border: paymentMethod === method.value ? "3px solid #3b82f6" : "2px solid #e0e0e0",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        background: paymentMethod === method.value ? "#eff6ff" : "white",
                                        transition: "all 0.3s"
                                    }}
                                >
                                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{method.icon}</div>
                                    <div style={{ fontWeight: "600" }}>{method.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amount */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                            Amount Paid *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 1095.00"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "2px solid #e0e0e0",
                                borderRadius: "8px",
                                fontSize: "16px"
                            }}
                        />
                    </div>

                    {/* Payment Reference */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                            Payment Reference / Transaction ID
                        </label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="e.g., TXN123456789"
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "2px solid #e0e0e0",
                                borderRadius: "8px",
                                fontSize: "16px"
                            }}
                        />
                        <small style={{ color: "#999" }}>
                            Enter your bank transfer reference or transaction ID
                        </small>
                    </div>

                    {/* === CARD PAYMENT FIELDS === */}
                    {paymentMethod === "CARD" && (
                        <div style={{
                            padding: "20px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            marginBottom: "20px"
                        }}>
                            <h3 style={{ marginBottom: "20px" }}>💳 Card Details</h3>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    Card Number *
                                </label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="16"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px",
                                        fontSize: "16px"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    Cardholder Name *
                                </label>
                                <input
                                    type="text"
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px",
                                        fontSize: "16px"
                                    }}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                        Expiry Date *
                                    </label>
                                    <input
                                        type="text"
                                        value={cardExpiryDate}
                                        onChange={(e) => setCardExpiryDate(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "2px solid #e0e0e0",
                                            borderRadius: "8px",
                                            fontSize: "16px"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value)}
                                        placeholder="123"
                                        maxLength="3"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "2px solid #e0e0e0",
                                            borderRadius: "8px",
                                            fontSize: "16px"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === BANK TRANSFER FIELDS === */}
                    {paymentMethod === "BANK_TRANSFER" && (
                        <div style={{
                            padding: "20px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            marginBottom: "20px"
                        }}>
                            <h3 style={{ marginBottom: "20px" }}>🏦 Bank Transfer Details</h3>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    Bank Name *
                                </label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="e.g., Bank of America"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px",
                                        fontSize: "16px"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    Account Number *
                                </label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="1234567890"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px",
                                        fontSize: "16px"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    Account Holder Name *
                                </label>
                                <input
                                    type="text"
                                    value={accountHolderName}
                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px",
                                        fontSize: "16px"
                                    }}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                        Branch Code
                                    </label>
                                    <input
                                        type="text"
                                        value={branchCode}
                                        onChange={(e) => setBranchCode(e.target.value)}
                                        placeholder="001"
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "2px solid #e0e0e0",
                                            borderRadius: "8px",
                                            fontSize: "16px"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                        Transfer Date
                                    </label>
                                    <input
                                        type="date"
                                        value={transferDate}
                                        onChange={(e) => setTransferDate(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "2px solid #e0e0e0",
                                            borderRadius: "8px",
                                            fontSize: "16px"
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    📎 Upload Receipt (Optional)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setReceiptFile(e.target.files[0])}
                                    accept="image/*,.pdf"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px"
                                    }}
                                />
                                <small style={{ color: "#999" }}>
                                    Upload your bank transfer receipt for verification
                                </small>
                            </div>
                        </div>
                    )}

                    {/* === PAYPAL FIELDS === */}
                    {paymentMethod === "PAYPAL" && (
                        <div style={{
                            padding: "20px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            marginBottom: "20px"
                        }}>
                            <h3 style={{ marginBottom: "20px" }}>💰 PayPal Details</h3>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    PayPal Email *
                                </label>
                                <input
                                    type="email"
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px",
                                        fontSize: "16px"
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                    PayPal Transaction ID *
                                </label>
                                <input
                                    type="text"
                                    value={paypalTransactionId}
                                    onChange={(e) => setPaypalTransactionId(e.target.value)}
                                    placeholder="e.g., 1AB23456CD789012E"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid #e0e0e0",
                                        borderRadius: "8px",
                                        fontSize: "16px"
                                    }}
                                />
                                <small style={{ color: "#999" }}>
                                    Find this in your PayPal transaction history
                                </small>
                            </div>
                        </div>
                    )}

                    {/* === CASH ON DELIVERY === */}
                    {paymentMethod === "CASH_ON_DELIVERY" && (
                        <div style={{
                            padding: "20px",
                            background: "#d1fae5",
                            borderRadius: "12px",
                            marginBottom: "20px",
                            textAlign: "center"
                        }}>
                            <div style={{ fontSize: "48px", marginBottom: "15px" }}>💵</div>
                            <h3 style={{ color: "#065f46", marginBottom: "10px" }}>
                                Cash on Delivery Selected
                            </h3>
                            <p style={{ color: "#065f46" }}>
                                You will pay in cash when your order is delivered. No upfront payment required!
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !selectedOrder || !paymentMethod || loadingOrders}
                        style={{
                            width: "100%",
                            padding: "16px",
                            background: (loading || !selectedOrder || !paymentMethod || loadingOrders) ? "#9ca3af" : "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "18px",
                            fontWeight: "600",
                            cursor: (loading || !selectedOrder || !paymentMethod || loadingOrders) ? "not-allowed" : "pointer",
                            marginTop: "10px"
                        }}
                    >
                        {loading ? "⏳ Submitting..." : "✓ Upload Payment"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/payments")}
                        style={{
                            width: "100%",
                            padding: "16px",
                            background: "white",
                            color: "#333",
                            border: "2px solid #e0e0e0",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            marginTop: "15px"
                        }}
                    >
                        Cancel
                    </button>

                    {message && (
                        <div style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: message.includes("✓") ? "#d1fae5" : message.includes("ℹ️") ? "#e0f2fe" : "#fee2e2",
                            color: message.includes("✓") ? "#065f46" : message.includes("ℹ️") ? "#0369a1" : "#991b1b",
                            borderRadius: "8px",
                            textAlign: "center",
                            fontWeight: "600"
                        }}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
