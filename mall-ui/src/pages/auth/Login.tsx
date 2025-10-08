import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth";
import { useAuth } from "../../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await loginApi(email, password);
      setAuth(token, "CUSTOMER"); // parse role later from JWT if needed
      nav("/");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "80vh", px: 2 }}>
      <Card sx={{ width: 420, p: 1 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Welcome back</Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Sign in to continue shopping.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required fullWidth />
              <TextField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required fullWidth />
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                New here? <Link to="/register">Create an account</Link>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
}
