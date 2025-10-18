import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();

    useEffect(() => {
        API.get("/payments")
            .then(res => setPayments(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2>Payments</h2>
            {loading ? (
                <div>Loading payments...</div>
            ) : (
                <ul>
                    {payments.length === 0 && <li>No payments found.</li>}
                    {payments.map(pay => (
                        <li key={pay.id}>
                            <b>Order:</b> {pay.orderId}{" "}
                            <b>Amount:</b> ${pay.amount}{" "}
                            <b>Status:</b> {pay.status}{" "}
                            <b>Date:</b> {pay.date}
                            {role === "ADMIN" || role === "VENDOR" ? (
                                <> {" "}
                                    <b>Method:</b> {pay.method}{" "}
                                    <b>Ref:</b> {pay.reference}
                                </>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
