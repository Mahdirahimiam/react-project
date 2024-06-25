import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Grid,
  Button,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CartCardItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs={3} container direction="row" alignItems="center">
          <Grid item xs={4}>
            <img src={item.image} alt={item.name} style={{ width: '100%' }} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">{item.name}</Typography>
            <Typography variant="body2">ویژگی ها: {item.features}</Typography>
            <Typography variant="body2">کد: {item.code}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1">{item.price.toLocaleString()} تومان</Typography>
        </Grid>

        <Grid item xs={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
              <AddIcon />
            </IconButton>
            <TextField
              value={item.quantity}
              variant="outlined"
              size="small"
              sx={{ width: 40, textAlign: 'center' }}
              inputProps={{ readOnly: true }}
            />
            <IconButton onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity === 1}>
              <RemoveIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{(item.price * item.quantity).toLocaleString()} تومان</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton color="error" onClick={() => onRemove(item.id)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

const CartCard = ({product}) => {
    console.log(product)
  const [CartCardItems, setCartCardItems] = useState([
    {
      id: 1,
      name: 'کیف کنزو 1158',
      features: 'تمام کرم',
      price: 450000,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
      code: 'p-4456271-2226461'
    }
  ]);

  const handleQuantityChange = (id, quantity) => {
    setCartCardItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const handleRemoveItem = id => {
    setCartCardItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <Box>
      {CartCardItems.map(item => (
        <CartCardItem
          key={item.id}
          item={item}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemoveItem}
        />
      ))}
    </Box>
  );
};

export default CartCard;
