import { useAuth } from "../AuthContext";
import CustomerDashboard from "./CustomerDashboard";
import VendorDashboard from "./VendorDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
    const { role } = useAuth();
    if (role === "CUSTOMER") return <CustomerDashboard />;
    if (role === "VENDOR")   return <VendorDashboard />;
    if (role === "ADMIN")    return <AdminDashboard />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4">
            <div className="glass-card max-w-sm w-full text-center py-12">
                <div className="text-5xl mb-5">🔒</div>
                <h2 className="text-white text-2xl font-black mb-3">Access Required</h2>
                <p className="text-slate-400 text-sm">Please log in to view your dashboard.</p>
            </div>
        </div>
    );
}