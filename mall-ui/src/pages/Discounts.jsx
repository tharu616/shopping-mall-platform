import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [newCode, setNewCode] = useState("");
    const [newPercent, setNewPercent] = useState(0);
    const [msg, setMsg] = useState("");
    const { role } = useAuth();

    function fetchDiscounts() {
        API.get("/discounts").then(res => setDiscounts(res.data));
    }
    useEffect(() => { fetchDiscounts(); }, []);

    async function handleAdd(e) {
        e.preventDefault();
        await API.post("/discounts", { code: newCode, percent: newPercent });
        setMsg("Discount added!");
        fetchDiscounts();
        setNewCode(""); setNewPercent(0);
    }

    async function handleDelete(id) {
        await API.delete(`/discounts/${id}`);
        fetchDiscounts();
    }

    return (
        <div>
            <h2>Discounts</h2>
            <ul>
                {discounts.map(d => (
                    <li key={d.id}>
                        <b>{d.code}</b> — {d.percent}%
                        {role === "ADMIN" && (
                            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(d.id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
            {role === "ADMIN" && (
                <form onSubmit={handleAdd}>
                    <input
                        value={newCode}
                        required
                        placeholder="Discount code"
                        onChange={e => setNewCode(e.target.value)}
                        style={{ marginRight: 8 }}
                    />
                    <input
                        type="number"
                        min={1}
                        max={100}
                        value={newPercent}
                        required
                        placeholder="Percent off"
                        onChange={e => setNewPercent(Number(e.target.value))}
                        style={{ width: "60px", marginRight: 8 }}
                    />
                    <button type="submit">Add Discount</button>
                </form>
            )}
            <div>{msg}</div>
        </div>
    );
}
