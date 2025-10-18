import { useState, useEffect } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();
    const [editCat, setEditCat] = useState(null);
    const [msg, setMsg] = useState("");

    // For create/edit
    const [catFields, setCatFields] = useState({ name: "", description: "" });

    function fetchCategories() {
        setLoading(true);
        API.get("/categories")
            .then(res => setCategories(res.data))
            .finally(() => setLoading(false));
    }

    useEffect(() => { fetchCategories(); }, []);

    function handleFieldChange(e) {
        setCatFields({ ...catFields, [e.target.name]: e.target.value });
    }

    function handleEdit(cat) {
        setEditCat(cat);
        setCatFields({ name: cat.name, description: cat.description });
        setMsg("");
    }

    // Save (create or update)
    async function handleSave(e) {
        e.preventDefault();
        try {
            if (editCat) {
                await API.put(`/categories/${editCat.id}`, catFields);
                setMsg("Category updated.");
            } else {
                await API.post("/categories", catFields);
                setMsg("Category created.");
            }
            setEditCat(null);
            setCatFields({ name: "", description: "" });
            fetchCategories();
        } catch {
            setMsg("Save failed.");
        }
    }

    async function handleDelete(cat) {
        if (window.confirm("Delete this category?")) {
            await API.delete(`/categories/${cat.id}`);
            fetchCategories();
        }
    }

    return (
        <div>
            <h2>Categories</h2>
            {role === "ADMIN" && (
                <form onSubmit={handleSave} style={{ marginBottom: 20 }}>
                    <input
                        name="name"
                        placeholder="Name"
                        value={catFields.name}
                        onChange={handleFieldChange}
                        required
                    />
                    <input
                        name="description"
                        placeholder="Description"
                        value={catFields.description}
                        onChange={handleFieldChange}
                        required
                    />
                    <button type="submit">{editCat ? "Update" : "Create"}</button>
                    {editCat && (
                        <button type="button" onClick={() => { setEditCat(null); setCatFields({ name: "", description: "" }); }}>
                            Cancel
                        </button>
                    )}
                    <div>{msg}</div>
                </form>
            )}

            <ul>
                {categories.map(cat => (
                    <li key={cat.id}>
                        <b>{cat.name}</b>{" — "}{cat.description}
                        {role === "ADMIN" && (
                            <>
                                {" "}
                                <button onClick={() => handleEdit(cat)}>Edit</button>
                                <button onClick={() => handleDelete(cat)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {categories.length === 0 && <div>No categories found.</div>}
        </div>
    );
}
