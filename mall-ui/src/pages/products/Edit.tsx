import { useEffect, useState } from "react";
import {
  Alert, Button, Card, CardContent, Checkbox, FormControlLabel, Grid2 as Grid,
  Stack, TextField, Typography
} from "@mui/material";
import { type ProductDto, createProduct, getProduct, updateProduct } from "../../api/products";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductEdit() {
  const { id } = useParams();
  const isNew = id === "new";
  const [p, setP] = useState<ProductDto>({
    sku: "", name: "", description: "", price: 0, stock: 0, active: true
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const nav = useNavigate();

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      getProduct(Number(id))
        .then((data) => setP({
          id: data.id,
          sku: data.sku,
          name: data.name,
          description: data.description || "",
          price: Number(data.price),
          stock: Number(data.stock),
          active: !!data.active
        }))
        .catch((e) => {
          const msg = e?.response?.data?.message || e?.message || "Load failed";
          setError(msg);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      // Basic client-side checks
      if (!p.sku || !p.name) throw new Error("SKU and Name are required");
      if (p.price < 0 || p.stock < 0) throw new Error("Price/Stock cannot be negative");

      if (isNew) {
        await createProduct(p);
      } else {
        await updateProduct(Number(id), p);
      }
      nav("/products");
    } catch (e: any) {
      const status = e?.response?.status;
      const body = e?.response?.data;
      const msg =
        body?.message ||
        body?.error ||
        (status ? `HTTP ${status}` : e?.message || "Save failed");
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card><CardContent><Typography>Loading...</Typography></CardContent></Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{isNew ? "Add Product" : "Edit Product"}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="SKU"
                value={p.sku}
                onChange={(e)=>setP({...p, sku: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Name"
                value={p.name}
                onChange={(e)=>setP({...p, name: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                value={p.description}
                onChange={(e)=>setP({...p, description: e.target.value})}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="number"
                label="Price"
                value={p.price}
                onChange={(e)=>setP({...p, price: Number(e.target.value)})}
                inputProps={{ step: "0.01" }}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="number"
                label="Stock"
                value={p.stock}
                onChange={(e)=>setP({...p, stock: Number(e.target.value)})}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!p.active}
                    onChange={(e)=>setP({...p, active: e.target.checked})}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button onClick={()=>nav("/products")}>Cancel</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
