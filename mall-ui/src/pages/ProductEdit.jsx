import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function ProductEdit() {
    const { id } = useParams();
    const { role } = useAuth();
    const navigate = useNavigate();

    const isEdit = !!id;
    const [fields, setFields] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        categoryId: "",
        active: true
    });
    const [msg, setMsg] = useState("");

    useEffect(() => {
        // Fetch existing product if editing
        if (isEdit) {
            API.get(`/products/${id}`).then(res => setFields(res.data));
        }
    }, [id, isEdit]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (isEdit) {
                await API.put(`/products/${id}`, fields);
                setMsg("Product updated.");
            } else {
                await API.post("/products", fields);
                setMsg("Product created.");
                navigate("/products");
            }
        } catch (err) {
            setMsg("Save failed.");
        }
    }

    function handleFieldChange(e) {
        const { name, value, type, checked } = e.target;
        setFields(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    if ((role !== "VENDOR" && role !== "ADMIN")) {
        return <div>You do not have permission.</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isEdit ? "Edit" : "Create"} Product</h2>
            <input name="name" placeholder="Name" value={fields.name} onChange={handleFieldChange} required />
            <input name="description" placeholder="Description" value={fields.description} onChange={handleFieldChange} required />
            <input name="price" type="number" step="0.01" placeholder="Price" value={fields.price} onChange={handleFieldChange} required />
            <input name="stock" type="number" min="0" placeholder="Stock" value={fields.stock} onChange={handleFieldChange} required />
            <input name="sku" placeholder="SKU" value={fields.sku} onChange={handleFieldChange} />
            <input name="categoryId" placeholder="Category ID" value={fields.categoryId} onChange={handleFieldChange} required />
            <label>
                Active:
                <input name="active" type="checkbox" checked={fields.active} onChange={handleFieldChange} />
            </label>
            <button type="submit">{isEdit ? "Update" : "Create"}</button>
            <div>{msg}</div>
        </form>
    );
}
