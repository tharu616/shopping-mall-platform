import { Typography } from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";
import CustomerDashboard from "./CustomerDashboard";
import { useAuth } from "../../store/authStore";

export default function DashboardSelector() {
  const { role } = useAuth();

  if (!role) {
    return <Typography>Please login to see your dashboard.</Typography>;
  }

  switch (role.toUpperCase()) {
    case "ADMIN":
      return <AdminDashboard />;
    case "VENDOR":
      return <VendorDashboard />;
    case "CUSTOMER":
    default:
      return <CustomerDashboard />;
  }
}

