import { Alert, Card, CardContent, Typography } from "@mui/material";
export default function ReviewsPage() {
  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Reviews</Typography>
      <Alert severity="info">Show approved product reviews and allow writing after purchase.</Alert>
    </CardContent></Card>
  );
}
