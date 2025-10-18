import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setMsg("");
        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.token, res.data.role);
            navigate("/");
        } catch (err) {
            setMsg(err.response?.data?.message || "Login failed");
        }
    }
    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button type="submit">Login</button>
            {msg && <div>{msg}</div>}
        </form>
    );
}
