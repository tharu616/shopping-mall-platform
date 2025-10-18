import { useState, useEffect } from "react";
import API from "../../api";
import { useAuth } from "../../AuthContext";

export default function Profile() {
    const { token, logout } = useAuth();
    const [user, setUser] = useState();
    const [fullName, setFullName] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await API.get("/users/me");
                setUser(res.data);
                setFullName(res.data.fullName);
            } catch (err) {
                setMsg("Not logged in"); logout();
            }
        }
        fetchProfile();
    }, [logout]);

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            await API.put("/users/me", { fullName });
            setMsg("Profile updated!");
        } catch (err) {
            setMsg("Update failed");
        }
    }

    if (!user) return <div>Loading...</div>;
    return (
        <form onSubmit={handleUpdate}>
            <h2>Profile</h2>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} />
            <button type="submit">Update</button>
            <button type="button" onClick={logout}>Logout</button>
            {msg && <div>{msg}</div>}
        </form>
    );
}
