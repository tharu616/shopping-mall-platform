import { CssBaseline, ThemeProvider, Container } from "@mui/material";
import { makeAppTheme } from "./theme";
import RoutesIndex from "./routes";

export default function App() {
  const theme = makeAppTheme("light");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <RoutesIndex />
      </Container>
    </ThemeProvider>
  );
}
