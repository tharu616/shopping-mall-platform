import { Alert, Card, CardContent, Typography } from "@mui/material";
export default function OrdersPage() {
  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>My Orders</Typography>
      <Alert severity="info">Fetch from /orders/me and render items with status chips.</Alert>
    </CardContent></Card>
  );
}
