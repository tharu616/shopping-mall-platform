import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getCart, updateCartItem, removeFromCart, clearCart, checkout } from '../../api/cart';
import type { CartDto } from '../../api/cart';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    try {
      await clearCart();
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    try {
      const order = await checkout(shippingAddress || undefined);
      alert(`Order placed successfully! Order ID: ${order.id}`);
      navigate('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color="text.secondary">Loading cart...</Typography>
      </Box>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEmpty ? 'Your cart is empty' : `${cart.items.length} item(s) in your cart`}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {isEmpty ? (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(197, 233, 227, 0.2) 0%, rgba(126, 223, 217, 0.1) 100%)',
              borderRadius: 4,
              border: '2px dashed rgba(22, 179, 172, 0.3)',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 80, color: '#16b3ac', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Add some products to get started!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d8b85 0%, #5cb5af 100%)',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {cart.items.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(197, 233, 227, 0.2) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      border: '1px solid rgba(22, 179, 172, 0.2)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(22, 179, 172, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        {/* Product Image Placeholder */}
                        <Grid item xs={12} sm={3}>
                          <Box
                            sx={{
                              height: 120,
                              background: 'linear-gradient(135deg, rgba(126, 223, 217, 0.3) 0%, rgba(158, 216, 208, 0.2) 100%)',
                              borderRadius: 2,
                            }}
                          />
                        </Grid>

                        {/* Product Info */}
                        <Grid item xs={12} sm={5}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {item.productName}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#16b3ac', fontWeight: 700 }}>
                            ${item.productPrice.toFixed(2)}
                          </Typography>
                        </Grid>

                        {/* Quantity Controls */}
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={2} alignItems="flex-end">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                sx={{
                                  bgcolor: '#16b3ac',
                                  color: 'white',
                                  '&:hover': { bgcolor: '#0d8b85' },
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography
                                sx={{
                                  minWidth: 40,
                                  textAlign: 'center',
                                  fontWeight: 600,
                                  fontSize: '1.1rem',
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                sx={{
                                  bgcolor: '#16b3ac',
                                  color: 'white',
                                  '&:hover': { bgcolor: '#0d8b85' },
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleRemove(item.id)}
                                sx={{
                                  color: '#ff8080',
                                  '&:hover': { bgcolor: 'rgba(255, 128, 128, 0.1)' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#16b3ac' }}>
                              ${item.subtotal.toFixed(2)}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearCart}
                sx={{ mt: 2 }}
              >
                Clear Cart
              </Button>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  position: 'sticky',
                  top: 80,
                  background: 'linear-gradient(135deg, rgba(22, 179, 172, 0.1) 0%, rgba(126, 223, 217, 0.05) 100%)',
                  border: '2px solid rgba(22, 179, 172, 0.2)',
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Order Summary
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Subtotal:</Typography>
                      <Typography fontWeight={600}>${cart.total.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Shipping:</Typography>
                      <Typography fontWeight={600}>Free</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" fontWeight={700}>
                        Total:
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#16b3ac' }}>
                        ${cart.total.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <TextField
                    fullWidth
                    label="Shipping Address (Optional)"
                    multiline
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleCheckout}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0d8b85 0%, #5cb5af 100%)',
                      },
                    }}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/')}
                    sx={{
                      mt: 2,
                      borderColor: '#16b3ac',
                      color: '#16b3ac',
                      '&:hover': {
                        borderColor: '#0d8b85',
                        bgcolor: 'rgba(22, 179, 172, 0.05)',
                      },
                    }}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
