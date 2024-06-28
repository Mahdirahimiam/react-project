import React,{useState} from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CartCard from '../../Components/CartCard'; // وارد کردن کامپوننت Cart

const steps = [
  { label: 'تکمیل سفارش', icon: <CheckCircleIcon />, active: true },
  { label: 'انتخاب شیوه پرداخت', icon: <PaymentIcon />, active: false },
  { label: 'انتخاب شیوه ارسال', icon: <LocalShippingIcon />, active: false },
  { label: 'تایید سفارش', icon: <ShoppingCartIcon />, active: true }
];

const ProgressBar = () => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: 2, backgroundColor: '#f0f0f0', borderRadius: '8px', marginBottom: 2 }}>
      {steps.map((step, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: step.active ? '#000' : '#2e2e2e', borderRadius: '5px', color: '#fff', flex: 1, justifyContent: 'center', margin: index !== steps.length - 1 ? '0 4px' : '0' }}>
          {step.icon}
          <Typography variant="body1" sx={{ marginLeft: 1 }}>{step.label}</Typography>
        </Box>
      ))}
    </Stack>
  );
  };
  
  const CartPage = () => {
    const items = products?.map((e,index)=>{
      <CartCard product={e} key={index}/>
    })
    return (
      <Box>
      {items}
      <ProgressBar />
      {/* سایر محتوای صفحه */}
    </Box>
  );
};

export default CartPage;
