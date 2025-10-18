import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../AuthContext";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("CUSTOMER"); // Or selection
    const [msg, setMsg] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setMsg("");
        try {
            const res = await API.post("/auth/register", { email, password, fullName, role });
            login(res.data.token, role);
            navigate("/");
        } catch (err) {
            setMsg(err.response?.data?.message || "Registration failed");
        }
    }
    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <select value={role} onChange={e=>setRole(e.target.value)}>
                <option value="CUSTOMER">Customer</option>
                <option value="VENDOR">Vendor</option>
            </select>
            <button type="submit">Register</button>
            {msg && <div>{msg}</div>}
        </form>
    );
}
