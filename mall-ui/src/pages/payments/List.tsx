import { Alert, Card, CardContent, Typography } from "@mui/material";
export default function PaymentsPage() {
  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Payments</Typography>
      <Alert severity="info">Use /payments/mine and /payments/upload to implement.</Alert>
    </CardContent></Card>
  );
}
