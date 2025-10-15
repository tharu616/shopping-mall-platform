import { useEffect, useState } from "react";
import { Alert, Card, CardContent, Grid2 as Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import StatCard from "../../components/StatCard";

type Order = { id: number; status: string; total: number; createdAt?: string };
type Cart = { items: { id: number; name: string; quantity: number; lineTotal: number }[]; total: number };

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8081/orders/me", { headers: auth() }).then(r => r.json()).catch(() => []),
      fetch("http://localhost:8081/cart", { headers: auth() }).then(r => r.json()).catch(() => null),
    ])
      .then(([o, c]) => {
        setOrders(o || []);
        setCart(c);
      })
      .catch((e) => setError(e.message));
  }, []);

  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const cartTotal = cart?.total ?? 0;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Customer Dashboard</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Orders" value={totalOrders} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending" value={pending} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Delivered" value={delivered} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Cart Total" value={`$${cartTotal.toFixed(2)}`} color="secondary" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Recent Orders
              </Typography>
              {orders.slice(0, 5).length === 0 ? (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  No orders yet.
                </Typography>
              ) : (
                <List>
                  {orders.slice(0, 5).map((o) => (
                    <ListItem key={o.id} divider>
                      <ListItemText primary={`Order #${o.id} — $${o.total.toFixed(2)}`} secondary={o.status} />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Cart Snapshot
              </Typography>
              {cart?.items?.length ? (
                <List>
                  {cart.items.slice(0, 5).map((i) => (
                    <ListItem key={i.id} divider>
                      <ListItemText primary={`${i.quantity} × ${i.name}`} secondary={`$${i.lineTotal.toFixed(2)}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Cart is empty.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

// Always return a Headers object to satisfy HeadersInit strictly
function auth(): Headers {
  const h = new Headers();
  const t = localStorage.getItem("token");
  if (t) h.set("Authorization", `Bearer ${t}`);
  return h;
}
