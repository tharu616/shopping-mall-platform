import { Outlet, Link } from "react-router-dom";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../store/authStore";

export default function AppLayout() {
  const { logout } = useAuth();
  return (
    <Box>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mall
          </Typography>
          <Button component={Link} to="/" color="primary">Home</Button>
          <Button component={Link} to="/profile" color="primary">Profile</Button>
          <Button onClick={logout} color="secondary">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
