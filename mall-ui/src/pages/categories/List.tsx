import { useEffect, useState } from "react";
import { Alert, Card, CardContent, Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";

type Category = { id: number; name: string; slug: string; active: boolean; parentId?: number | null };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = new Headers();
    const t = localStorage.getItem("token");
    if (t) h.set("Authorization", `Bearer ${t}`);

    fetch("http://localhost:8081/categories", { headers: h })
      .then(async (r) => {
        // If server returned no content or non-JSON, avoid r.json() crash
        const ct = r.headers.get("content-type") || "";
        if (!r.ok) {
          // try to read error message safely
          let msg = `HTTP ${r.status}`;
          if (ct.includes("application/json")) {
            try {
              const body = await r.json();
              msg = body?.message || body?.error || msg;
            } catch {}
          } else {
            try {
              const text = await r.text();
              if (text) msg = text;
            } catch {}
          }
          throw new Error(msg);
        }
        if (!ct.includes("application/json")) return [] as Category[];
        // handle empty body safely
        const text = await r.text();
        if (!text) return [] as Category[];
        return JSON.parse(text) as Category[];
      })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setErr(e.message || "Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.slug.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Categories</Typography>
      {err && <Alert severity="error">{err}</Alert>}
      <TextField
        placeholder="Search categories..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        fullWidth
      />
      {loading ? (
        <Typography variant="body2" sx={{ opacity: 0.8 }}>Loading…</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {filtered.map((c) => (
              <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{c.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      /{c.slug}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {c.active ? "Active" : "Inactive"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {filtered.length === 0 && !err && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              No categories found.
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
}
