import React, { createContext, useContext, useMemo, useState } from "react";

type AuthCtx = {
  token: string | null;
  role: string | null;
  setAuth: (token: string, role: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const api: AuthCtx = useMemo(
    () => ({
      token,
      role,
      setAuth: (t, r) => {
        setToken(t);
        setRole(r);
        localStorage.setItem("token", t);
        localStorage.setItem("role", r);
      },
      logout: () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      },
    }),
    [token, role]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("AuthProvider missing");
  return v;
}
