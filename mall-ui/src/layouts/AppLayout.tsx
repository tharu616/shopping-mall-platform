import { Outlet, Link, useLocation } from "react-router-dom";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../store/authStore";

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const loc = useLocation();
  const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
  return (
    <Button
      component={Link}
      to={to}
      size="small"
      variant={active ? "contained" : "text"}
      color={active ? "secondary" : "inherit"}
      sx={{ borderRadius: 999 }}
    >
      {label}
    </Button>
  );
};

// simple helpers
const isAdmin = (role?: string | null) => role?.toUpperCase() === "ADMIN";
const isVendor = (role?: string | null) => role?.toUpperCase() === "VENDOR";
const isCustomer = (role?: string | null) =>
  !role || role.toUpperCase() === "CUSTOMER";

export default function AppLayout() {
  const { token, role, logout } = useAuth();

  return (
    <Box>
      <AppBar position="sticky" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: 76 }}>
          <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              <span className="gradient-text">MallX</span>
            </Typography>

            <Stack direction="row" spacing={1} sx={{ ml: 2, flex: 1 }}>
              <NavLink to="/" label="Home" />
              <NavLink to="/products" label="Products" />
              <NavLink to="/categories" label="Categories" />
              <NavLink to="/cart" label="Cart" />
              <NavLink to="/orders" label="Orders" />
              <NavLink to="/payments" label="Payments" />
              <NavLink to="/reviews" label="Reviews" />

              {/* role-aware dashboard entries */}
              {isAdmin(role) && <NavLink to="/dashboard/admin" label="Admin" />}
              {isVendor(role) && <NavLink to="/dashboard/vendor" label="Vendor" />}
              {isCustomer(role) && <NavLink to="/dashboard" label="Dashboard" />}
            </Stack>

            <Stack direction="row" spacing={1}>
              {!token ? (
                <>
                  <Button component={Link} to="/login" color="inherit">
                    Login
                  </Button>
                  <Button component={Link} to="/register" variant="contained">
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/profile" color="inherit">
                    Profile
                  </Button>
                  <Button onClick={logout} variant="contained" color="secondary">
                    Logout
                  </Button>
                </>
              )}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box className="glow" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}
