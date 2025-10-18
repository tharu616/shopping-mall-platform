import { createContext, useContext, useState } from "react";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    const login = (t, r) => {
        setToken(t); setRole(r);
        localStorage.setItem("token", t);
        localStorage.setItem("role", r);
    };
    const logout = () => {
        setToken(""); setRole("");
        localStorage.removeItem("token"); localStorage.removeItem("role");
    };
    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);
