import { CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import RoutesIndex from './routes';
import { makeAppTheme } from './theme';
import { useCart } from './store/cartStore';

export default function App() {
  const theme = makeAppTheme('light');
  const refreshCart = useCart((s) => s.refresh);
  useEffect(() => { refreshCart(); }, [refreshCart]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoutesIndex />
    </ThemeProvider>
  );
}
