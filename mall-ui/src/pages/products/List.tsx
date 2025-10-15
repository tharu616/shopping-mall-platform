import { Grid2 as Grid, Stack, TextField } from "@mui/material";
import ProductCard from "../../components/ProductCard";
import { useEffect, useState } from "react";
import { listProducts, type ProductDto } from "../../api/products";

export default function ProductsPage() {
  const [items, setItems] = useState<ProductDto[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { listProducts().then(setItems); }, []);
  const filtered = items.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Stack spacing={2}>
      <TextField
        placeholder="Search products..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        fullWidth
      />
      <Grid container spacing={2}>
        {filtered.map(p => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard
              name={p.name}
              price={Number(p.price)}
              description={p.description}
              onView={() => {/* navigate to detail */}}
              onAdd={() => {/* call add-to-cart */}}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
