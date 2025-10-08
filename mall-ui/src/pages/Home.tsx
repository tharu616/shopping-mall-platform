import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Home</Typography>
      <Stack direction="row" spacing={2}>
        <Button component={Link} to="/login" variant="contained">Login</Button>
        <Button component={Link} to="/register" variant="outlined">Register</Button>
      </Stack>
    </Stack>
  );
}
