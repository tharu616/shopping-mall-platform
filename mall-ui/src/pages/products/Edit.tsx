import { Alert, Button, Card, CardContent, Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";
export default function ProductEdit() {
  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Product Editor</Typography>
      <Alert severity="info">Hook this to your existing product edit form.</Alert>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs:12, md:6 }}><TextField label="SKU" fullWidth /></Grid>
          <Grid size={{ xs:12, md:6 }}><TextField label="Name" fullWidth /></Grid>
          <Grid size={{ xs:12 }}><TextField label="Description" multiline minRows={3} fullWidth /></Grid>
          <Grid size={{ xs:12, md:6 }}><TextField label="Price" type="number" fullWidth /></Grid>
          <Grid size={{ xs:12, md:6 }}><TextField label="Stock" type="number" fullWidth /></Grid>
        </Grid>
        <Button variant="contained">Save</Button>
      </Stack>
    </CardContent></Card>
  );
}
