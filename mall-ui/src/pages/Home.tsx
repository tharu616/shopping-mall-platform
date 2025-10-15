import { Box, Button, Container, Grid, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../store/cartStore';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // cart store actions
  const add = useCart((s) => s.add);

  useEffect(() => {
    listProducts().then(setProducts).catch(console.error);
  }, []);

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      await add(productId, 1); // uses store -> updates navbar badge automatically
      setSnackbar({
        open: true,
        message: `${productName} added to cart!`,
        severity: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          'Failed to add to cart. Please login first.',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            'linear-gradient(135deg, rgba(126, 223, 217, 0.3) 0%, rgba(158, 216, 208, 0.2) 50%, rgba(255, 214, 214, 0.1) 100%)',
          py: { xs: 8, md: 12 },
          px: 3,
          textAlign: 'center',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 4px 20px rgba(22, 179, 172, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              background:
                'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Discover the future of shopping
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Curated products, dazzling gradients, and glassmorphism UI.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d8b85 0%, #5cb5af 100%)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Browse products
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/cart')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                textTransform: 'none',
                borderColor: '#16b3ac',
                color: '#16b3ac',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#0d8b85',
                  bgcolor: 'rgba(22, 179, 172, 0.05)',
                },
              }}
            >
              Go to cart
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 4,
            color: 'text.primary',
            fontSize: { xs: '1.75rem', md: '2.125rem' },
          }}
        >
          Featured products
        </Typography>

        <Grid container spacing={3}>
          {products.slice(0, 8).map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, rgba(197, 233, 227, 0.3) 0%, rgba(126, 223, 217, 0.2) 100%)',
                  borderRadius: 4,
                  p: 2,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(22, 179, 172, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(22, 179, 172, 0.15)',
                    border: '1px solid rgba(22, 179, 172, 0.3)',
                  },
                }}
              >
                <ProductCard
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  isNew={product.id % 3 === 0}
                  onView={() => navigate(`/products/${product.id}`)}
                  onAdd={() => handleAddToCart(product.id, product.name)}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
