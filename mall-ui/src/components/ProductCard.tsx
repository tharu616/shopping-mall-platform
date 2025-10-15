import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export default function ProductCard({ 
  name, 
  price, 
  description, 
  onView, 
  onAdd,
  isNew = false
} : {
  name: string; 
  price: number; 
  description?: string; 
  onView?: () => void; 
  onAdd?: () => void;
  isNew?: boolean;
}) {
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'transparent',
        border: 'none',
      }}
    >
      {/* Product Image Placeholder */}
      <Box
        sx={{
          height: 180,
          background: 'linear-gradient(135deg, rgba(197, 233, 227, 0.4) 0%, rgba(126, 223, 217, 0.3) 100%)',
          borderRadius: 3,
          mb: 2,
          position: 'relative',
        }}
      >
        {isNew && (
          <Chip
            label="New"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: '#16b3ac',
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 0 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            color: 'text.primary',
          }}
        >
          {name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, minHeight: 40 }}
        >
          {description || "No description"}
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: '#16b3ac'
            }}
          >
            ${price.toFixed(2)}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1}>
          {onView && (
            <Button 
              variant="outlined"
              onClick={onView}
              sx={{
                flex: 1,
                borderColor: '#16b3ac',
                color: '#16b3ac',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#0d8b85',
                  bgcolor: 'rgba(22, 179, 172, 0.05)',
                },
              }}
            >
              View
            </Button>
          )}
          {onAdd && (
            <Button 
              variant="contained"
              onClick={onAdd}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #16b3ac 0%, #7edfd9 100%)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d8b85 0%, #5cb5af 100%)',
                },
              }}
            >
              Add to cart
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
