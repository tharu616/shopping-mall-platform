import { Button, Card, CardContent, MenuItem, Stack, TextField, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth";
import { useAuth } from "../../store/authStore";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { email, password, fullName, role };
      const { token } = await registerApi(payload);
      setAuth(token, role as any);
      nav("/");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "80vh", px: 2 }}>
      <Card sx={{ width: 520, p: 1 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Create account</Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Join and start exploring products.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField label="Full name" value={fullName} onChange={(e)=>setFullName(e.target.value)} required fullWidth />
              <TextField label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required fullWidth />
              <TextField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required fullWidth />
              <TextField select label="Role" value={role} onChange={(e)=>setRole(e.target.value)} fullWidth>
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="VENDOR">Vendor</MenuItem>
              </TextField>
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
}
