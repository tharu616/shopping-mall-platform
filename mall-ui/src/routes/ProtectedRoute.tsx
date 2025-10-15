import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  const loc = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
