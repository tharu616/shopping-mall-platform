import { useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, Grid2 as Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";

type Product = { id: number; name: string; stock: number; price: number; active: boolean };

export default function VendorDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const h = new Headers();
    const t = localStorage.getItem("token");
    if (t) h.set("Authorization", `Bearer ${t}`);
    fetch("http://localhost:8081/products", { headers: h })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setProducts(data || []))
      .catch((e) => setError(e.message || "Failed to load products"));
  }, []);

  const activeCount = products.filter(p => p.active).length;
  const lowStock = products.filter(p => p.stock <= 5);
  const totalSkus = products.length;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Vendor Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="secondary" onClick={() => nav('/products/new')}>Add product</Button>
          <Button variant="outlined" onClick={() => nav('/products')}>Manage products</Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs:12, sm:6, md:4 }}><StatCard title="Total SKUs" value={totalSkus} color="primary" /></Grid>
        <Grid size={{ xs:12, sm:6, md:4 }}><StatCard title="Active" value={activeCount} color="success" /></Grid>
        <Grid size={{ xs:12, sm:6, md:4 }}><StatCard title="Low stock" value={lowStock.length} color="error" /></Grid>
      </Grid>

      <Card><CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Low stock alerts (≤ 5)</Typography>
        {lowStock.length === 0 ? <Typography variant="body2" sx={{ opacity: 0.8 }}>All good.</Typography> :
        <List>
          {lowStock.map(p => (
            <ListItem key={p.id} divider>
              <ListItemText primary={`${p.name} — ${p.stock} left`} secondary={`$${p.price.toFixed(2)}`} />
              <Button onClick={() => nav(`/products/${p.id}/edit`)} variant="text">Edit</Button>
            </ListItem>
          ))}
        </List>}
      </CardContent></Card>
    </Stack>
  );
}
