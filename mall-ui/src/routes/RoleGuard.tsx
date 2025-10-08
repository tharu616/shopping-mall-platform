import type { ReactNode } from "react";
import { useAuth } from "../store/authStore";

export default function RoleGuard({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { role } = useAuth();
  if (!role || !roles.includes(role)) return null;
  return <>{children}</>;
}
