import { create } from "zustand";

type Role = "ADMIN" | "VENDOR" | "CUSTOMER";
type AuthState = {
  token: string | null;
  role: Role | null;
  setAuth: (token: string, role: Role) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: (localStorage.getItem("role") as Role) || null,
  setAuth: (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    set({ token, role });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ token: null, role: null });
    location.href = "/login";
  },
}));
