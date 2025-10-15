import { useEffect, useMemo, useState } from "react";
import { Alert, Card, CardContent, Grid2 as Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import StatCard from "../../components/StatCard";

type Order = { id: number; status: string; total: number };
type Payment = { id: number; reference: string; amount: number; status: string };

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingPay, setPendingPay] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8081/orders", { headers: auth() }).then(r => r.json()).catch(() => []),
      fetch("http://localhost:8081/payments/pending", { headers: auth() }).then(r => r.json()).catch(() => []),
    ])
      .then(([o, p]) => {
        setOrders(o || []);
        setPendingPay(p || []);
      })
      .catch((e) => setError(e.message));
  }, []);

  const kpis = useMemo(() => {
    const totalSales = orders.reduce((s, o) => s + (o.total || 0), 0);
    const byStatus = (s: string) => orders.filter((o) => o.status === s).length;
    return {
      totalOrders: orders.length,
      totalSales,
      pending: byStatus("PENDING"),
      confirmed: byStatus("CONFIRMED"),
      processing: byStatus("PROCESSING"),
      shipped: byStatus("SHIPPED"),
      delivered: byStatus("DELIVERED"),
      cancelled: byStatus("CANCELLED"),
    };
  }, [orders]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Admin Dashboard</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Orders" value={kpis.totalOrders} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Sales" value={`$${kpis.totalSales.toFixed(2)}`} color="secondary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending" value={kpis.pending} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Delivered" value={kpis.delivered} color="success" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Orders by status
              </Typography>
              <List dense>
                {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                  <ListItem key={s} divider>
                    <ListItemText primary={s} secondary={`Count: ${orders.filter((o) => o.status === s).length}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Pending payments
              </Typography>
              {pendingPay.length === 0 ? (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  No pending payments.
                </Typography>
              ) : (
                <List>
                  {pendingPay.slice(0, 8).map((p) => (
                    <ListItem key={p.id} divider>
                      <ListItemText primary={`${p.reference}`} secondary={`$${p.amount.toFixed(2)} — ${p.status}`} />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

function auth(): Headers {
  const h = new Headers();
  const t = localStorage.getItem("token");
  if (t) h.set("Authorization", `Bearer ${t}`);
  return h;
}
