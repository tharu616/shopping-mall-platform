import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);

                // Extract role from token (check your backend JWT structure)
                // It might be decoded.role or decoded.authorities[0].authority
                const userRole = decoded.role ||
                    decoded.authorities?.[0]?.authority ||
                    decoded.authorities?.[0] ||
                    "CUSTOMER";

                setRole(userRole.replace("ROLE_", "")); // Remove ROLE_ prefix if present
            } catch (err) {
                console.error("Invalid token - logging out");
                logout();
            }
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);

        // Decode immediately after login
        try {
            const decoded = jwtDecode(newToken);
            const userRole = decoded.role ||
                decoded.authorities?.[0]?.authority ||
                decoded.authorities?.[0] ||
                "CUSTOMER";
            setRole(userRole.replace("ROLE_", ""));
        } catch (err) {
            console.error("Failed to decode token");
        }
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
