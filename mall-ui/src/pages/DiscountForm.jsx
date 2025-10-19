import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function DiscountForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        percentage: "",
        startsAt: "",
        endsAt: "",
        active: true
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            API.get(`/discounts/${id}`)
                .then(res => {
                    const discount = res.data;
                    setFormData({
                        code: discount.code,
                        name: discount.name,
                        percentage: discount.percentage,
                        startsAt: discount.startsAt ? new Date(discount.startsAt).toISOString().slice(0, 16) : "",
                        endsAt: discount.endsAt ? new Date(discount.endsAt).toISOString().slice(0, 16) : "",
                        active: discount.active
                    });
                })
                .catch(() => setMsg("Failed to load discount."));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        // Validation
        if (!formData.code.trim() || !formData.percentage) {
            setMsg("Code and percentage are required.");
            setLoading(false);
            return;
        }

        const payload = {
            code: formData.code.trim().toUpperCase(),
            name: formData.name.trim() || formData.code.trim().toUpperCase(),
            percentage: parseFloat(formData.percentage),
            startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
            endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
            active: formData.active
        };

        try {
            if (isEdit) {
                await API.put(`/discounts/${id}`, payload);
                setMsg("Discount updated successfully!");
            } else {
                await API.post("/discounts", payload);
                setMsg("Discount created successfully!");
            }
            setTimeout(() => navigate("/discounts"), 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} discount.`;
            setMsg(errorMsg);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>{isEdit ? "Edit Discount" : "Create New Discount"}</h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label><b>Discount Code: *</b></label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="e.g., SUMMER2025"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            textTransform: "uppercase"
                        }}
                    />
                    <small style={{ color: "#666" }}>Will be converted to uppercase</small>
                </div>

                <div>
                    <label><b>Display Name:</b></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Summer Sale 2025"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <small style={{ color: "#666" }}>Optional - defaults to code if empty</small>
                </div>

                <div>
                    <label><b>Discount Percentage: *</b></label>
                    <input
                        type="number"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleChange}
                        placeholder="e.g., 20"
                        min="1"
                        max="100"
                        step="0.01"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <small style={{ color: "#666" }}>Enter value between 1 and 100</small>
                </div>

                <div>
                    <label><b>Start Date (Optional):</b></label>
                    <input
                        type="datetime-local"
                        name="startsAt"
                        value={formData.startsAt}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>

                <div>
                    <label><b>End Date (Optional):</b></label>
                    <input
                        type="datetime-local"
                        name="endsAt"
                        value={formData.endsAt}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        id="active"
                    />
                    <label htmlFor="active"><b>Active</b></label>
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
                    {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Discount" : "Create Discount")}
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
                onClick={() => navigate("/discounts")}
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
