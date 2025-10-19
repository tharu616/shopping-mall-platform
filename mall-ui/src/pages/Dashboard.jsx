import { useAuth } from "../AuthContext";
import CustomerDashboard from "./CustomerDashboard";
import VendorDashboard from "./VendorDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
    const { role } = useAuth();

    if (role === "CUSTOMER") return <CustomerDashboard />;
    if (role === "VENDOR") return <VendorDashboard />;
    if (role === "ADMIN") return <AdminDashboard />;

    return <div>Please log in to view your dashboard.</div>;
}
