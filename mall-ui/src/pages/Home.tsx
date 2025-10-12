import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box sx={{ borderRadius: 3, p: { xs: 4, md: 6 },
      background: "linear-gradient(180deg, rgba(124,58,237,0.25), rgba(6,182,212,0.25))",
      boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }}>
      <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
        Discover the future of shopping
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.85, maxWidth: 720, mb: 3 }}>
        Curated products, dazzling gradients, and glassmorphism UI.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button component={Link} to="/products" size="large" variant="contained">Browse products</Button>
        <Button component={Link} to="/cart" size="large" variant="contained" color="secondary">Go to cart</Button>
      </Stack>
    </Box>
  );
}
