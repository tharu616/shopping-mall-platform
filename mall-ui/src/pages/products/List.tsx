import { useEffect, useMemo, useState } from "react";
import { listProducts, deleteProduct, type ProductDto } from "../../api/products";
import {
  Alert, Box, Button, Card, CardContent, IconButton, InputAdornment, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

export default function ProductList() {
  const [rows, setRows] = useState<ProductDto[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setError(null);
      const data = await listProducts();
      setRows(data);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(r =>
      r.sku.toLowerCase().includes(term) ||
      r.name.toLowerCase().includes(term)
    );
  }, [rows, q]);

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Delete failed";
      setError(msg);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Products</Typography>
          <Button variant="contained" onClick={() => nav("/products/new")}>Add Product</Button>
        </Stack>

        <TextField
          placeholder="Search by SKU or name..."
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.sku}</TableCell>
                  <TableCell>
                    <Button component={Link} to={`/products/${r.id}/edit`}>{r.name}</Button>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                    {r.description}
                  </TableCell>
                  <TableCell>${Number(r.price).toFixed(2)}</TableCell>
                  <TableCell>{r.stock}</TableCell>
                  <TableCell>{r.active ? "Yes" : "No"}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => remove(r.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {(!loading && filtered.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>No products found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}
