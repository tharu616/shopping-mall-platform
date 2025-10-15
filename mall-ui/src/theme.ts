import { createTheme, type Theme } from '@mui/material/styles';

export function makeAppTheme(mode: 'light' | 'dark'): Theme {
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#16b3ac',      // Turquoise from your palette
        light: '#7edfd9',     // Light turquoise
        dark: '#0d8b85',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#9ed8d0',      // Mint green from your palette
        light: '#c5e9e3',
        dark: '#7fc0b6',
        contrastText: '#000000',
      },
      success: {
        main: '#7edfd9',      // Light turquoise
        light: '#a8ebe6',
        dark: '#5cb5af',
        contrastText: '#000000',
      },
      info: {
        main: '#16b3ac',
        light: '#4dc5bf',
        dark: '#0d8b85',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ffd6d6',      // Soft pink from your palette
        light: '#ffe6e6',
        dark: '#ffb3b3',
        contrastText: '#000000',
      },
      error: {
        main: '#ffb3b3',
        light: '#ffd6d6',
        dark: '#ff8080',
        contrastText: '#000000',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#1a1a1a',
        paper: mode === 'light' ? '#ffffff' : '#2d2d2d',
      },
      text: {
        primary: mode === 'light' ? '#2d3748' : '#ffffff',
        secondary: mode === 'light' ? '#4a5568' : '#b0b0b0',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(22, 179, 172, 0.2)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0d8b85 0%, #5cb5af 100%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(22, 179, 172, 0.08)',
            border: '1px solid rgba(158, 216, 208, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(22, 179, 172, 0.15)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
            boxShadow: '0 2px 12px rgba(22, 179, 172, 0.15)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: '#16b3ac',
            color: '#ffffff',
          },
          colorSecondary: {
            backgroundColor: '#9ed8d0',
            color: '#2d3748',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover fieldset': {
                borderColor: '#16b3ac',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#16b3ac',
              },
            },
          },
        },
      },
    },
  });
}

// Default export for backward compatibility
export default makeAppTheme('light');
