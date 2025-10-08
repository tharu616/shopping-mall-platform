import { CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./store/authStore";
import ProductList from "./pages/products/List";
import ProductEdit from "./pages/products/Edit";


const theme = createTheme({
  palette: { mode: "light", primary: { main: "#0ea5e9" }, secondary: { main: "#9333ea" } },
  shape: { borderRadius: 12 }
});

function Home() { return <Typography variant="h5">Home works!</Typography>; }

export default function App() {
  const { token, logout } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Mall</Typography>
          <Typography component={Link} to="/" sx={{ textDecoration: "none", color: "primary.main", mr: 2 }}>Home</Typography>
          {token ? (
            <>
              <Typography component={Link} to="/profile" sx={{ textDecoration: "none", color: "primary.main", mr: 2 }}>Profile</Typography>
              <Button onClick={logout} color="secondary">Logout</Button>
            </>
          ) : (
            <>
              <Typography component={Link} to="/login" sx={{ textDecoration: "none", color: "primary.main", mr: 2 }}>Login</Typography>
              <Typography component={Link} to="/register" sx={{ textDecoration: "none", color: "primary.main" }}>Register</Typography>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/products/new" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
          <Route path="/products/:id/edit" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />

        </Routes>
      </Container>
    </ThemeProvider>
  );
}
