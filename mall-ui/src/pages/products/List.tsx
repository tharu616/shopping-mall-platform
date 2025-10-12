import { useEffect, useState } from "react";
import { Card, CardContent, Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";

type Product = { id: number; sku: string; name: string; description?: string; price: number; stock: number; active: boolean; };

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/products").then(r=>r.json()).then(setItems).catch(()=>setItems([]));
  }, []);

  const filtered = items.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Products</Typography>
        <TextField placeholder="Search products..." value={q} onChange={(e)=>setQ(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {filtered.map(p => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.75 }}>{p.sku}</Typography>
                    <Typography variant="h6">{p.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, minHeight: 40 }}>{p.description}</Typography>
                    <Typography variant="h6">${p.price.toFixed(2)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
