import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import 'boxicons'
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge, Icon, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Link } from 'react-router-dom';
import ResponsiveNavbar from './ResponsiveNavbar'
import { useState } from 'react';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const CustomTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    border: 'none',
  },
});

export default function SearchAppBar() {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };
  return (
    <>
      <Stack flexWrap={'wrap'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ backgroundColor: 'inherit' }}>
        <Link to={'/'} sx={{ padding: '20px 0' }}>
          <img style={{ width: '80px', height: '118px' }} src="https://cdnfa.com/shikomod/dfb3/uploads/shiko-aoatar.png" alt="" />
        </Link>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'start'} sx={{ borderRadius: '10px', padding: '10px 20px', height: '40px', width: '30vw', color: '#686e74', backgroundColor: '#f3f3f3', position: 'relative' }}>
          <SearchIcon />
          <Box width={'100%'}>
            <CustomTextField
              placeholder="جستوجوی محصول,دسته,برند..."
            />
          </Box>
        </Stack>
        <Stack direction={'row'} sx={{ flexWrap: 'nowrap', padding: '20px 0' }} position={'relative'}>
          <Stack sx={{ cursor: 'pointer' }} direction={'row'} alignItems={'center'} justifyContent={'center'} onClick={() => { handleShow() }}>
            <PermIdentityIcon sx={{ borderRight: '2px solid #686e74', width: '40px', height: '40px', padding: '0 5px' }} />
            <Typography sx={{ padding: '0 0 0 15px' }} variant="body1">ورود/ثبت نام</Typography>
            <Stack visibility={show ? 'visible' : 'hidden'} fontSize={'10px'} boxShadow={'0 0 5px 0 #686e74'} borderRadius={'10px'} width={'200px'} bgcolor={'#fff'} position={'absolute'} top={'80px'} left={0} zIndex={50}>
              <Stack className='login-item' padding={'15px 15px 10px 15px'} direction={'row'} justifyContent={'start'} alignItems={'center'}>
                <box-icon name='log-in'></box-icon>
                <Typography>ورود</Typography>
              </Stack>
              <Stack className='login-item' padding={'10px 15px 10px 15px'} direction={'row'} justifyContent={'start'} alignItems={'center'}>
                <box-icon name='user-plus'></box-icon>
                <Typography>ثبت نام</Typography>
              </Stack>
              <Stack className='login-item' padding={'10px 15px 15px 15px'} direction={'row'} justifyContent={'start'} alignItems={'center'}>
                <box-icon type='solid' name='cart-alt'></box-icon>
                <Typography>پیگیری سفارش</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Box sx={{ borderRight: '2px solid #686e74', padding: '0 5px' }}></Box>
          <Badge sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} badgeContent={4} color="success">
            <box-icon name='basket'></box-icon>
          </Badge>
        </Stack>
      </Stack>
      <List sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexWrap: 'nowrap' }}>
        <ListItem>
          <ListItemText><Link style={{ color: '#333' }} to={'ksmme'}>کیف</Link></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>کفش</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>پوشاک</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <box-icon type='solid' name='book-alt'></box-icon>
          </ListItemIcon>
          <ListItemText>مجله تخصصی کیف و کفش</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>حراج</ListItemText>
        </ListItem>
        <ListItem>
          <ResponsiveNavbar />
        </ListItem>
      </List>
    </>
  );
}
