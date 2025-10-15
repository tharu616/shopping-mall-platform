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
      sx={{
        color: active ? "white" : "rgba(255,255,255,0.8)",
        fontWeight: active ? 600 : 400,
        textTransform: "none",
        fontSize: "1rem",
        px: 2,
        borderBottom: active ? "3px solid white" : "3px solid transparent",
        borderRadius: 0,
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      {label}
    </Button>
  );
};

export default function AppLayout() {
  const { token, logout } = useAuth();
  
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                mr: 4,
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
                letterSpacing: 1,
              }}
            >
              MallX
            </Typography>
            
            <Stack direction="row" spacing={0} sx={{ flexGrow: 1 }}>
              <NavLink to="/" label="Home" />
              <NavLink to="/products" label="Products" />
              <NavLink to="/categories" label="Categories" />
              <NavLink to="/cart" label="Cart" />
              <NavLink to="/orders" label="Orders" />
              <NavLink to="/payments" label="Payments" />
              <NavLink to="/reviews" label="Reviews" />
            </Stack>
            
            <Stack direction="row" spacing={1}>
              {!token ? (
                <>
                  <Button 
                    component={Link} 
                    to="/login" 
                    sx={{ 
                      color: "white",
                      textTransform: "none",
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register" 
                    variant="outlined"
                    sx={{ 
                      color: "white",
                      borderColor: "white",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/profile" label="Profile" />
                  <Button 
                    onClick={logout} 
                    sx={{ 
                      color: "white",
                      textTransform: "none",
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
