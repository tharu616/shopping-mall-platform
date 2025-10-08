// src/pages/profile/Profile.tsx
import { Button, Card, CardContent, Stack, TextField, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { getMe, updateMe, type UserDto } from "../../api/user";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [me, setMe] = useState<UserDto | null>(null);
  const [fullName, setFullName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const u = await getMe();
        setMe(u);
        setFullName(u.fullName ?? "");
      } catch (e: any) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        const message = body?.message || body?.error || (status ? `HTTP ${status}` : e?.message || "Failed to load profile");
        setError(message);
        // If unauthorized, force re-login to guarantee a fresh JWT
        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setTimeout(() => nav("/login"), 500);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  const save = async () => {
    setMsg(null); setError(null);
    try {
      const u = await updateMe(fullName);
      setMe(u);
      setMsg("Profile updated");
      setTimeout(()=>setMsg(null), 1500);
    } catch (e: any) {
      const status = e?.response?.status;
      const body = e?.response?.data;
      const message = body?.message || body?.error || (status ? `HTTP ${status}` : e?.message || "Update failed");
      setError(message);
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => nav("/login"), 500);
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">My Profile</Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {me && (
          <Stack spacing={2} sx={{ mt: 2, maxWidth: 480 }}>
            <TextField label="Email" value={me.email} InputProps={{ readOnly: true }} />
            <TextField label="Full name" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
            <Button variant="contained" onClick={save}>Save</Button>
            {msg && <Alert severity="success">{msg}</Alert>}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
