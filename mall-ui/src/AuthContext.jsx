// src/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// ✅ Safe default so destructuring never fails
const AuthContext = createContext({
    token: null,
    role: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [role, setRole] = useState(null);

    const extractRole = (tkn) => {
        try {
            const decoded = jwtDecode(tkn);
            const userRole =
                decoded.role ||
                decoded.authorities?.[0]?.authority ||
                decoded.authorities?.[0] ||
                "CUSTOMER";
            return userRole.replace("ROLE_", "");
        } catch {
            return null;
        }
    };

    // ✅ On first load, extract role from existing token
    useEffect(() => {
        if (token) {
            const r = extractRole(token);
            if (r) {
                setRole(r);
            } else {
                logout();
            }
        }
    }, []);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setRole(extractRole(newToken));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// ✅ Safe hook — never returns undefined
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
};