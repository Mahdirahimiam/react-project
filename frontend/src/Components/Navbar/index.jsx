import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import styled from 'styled-components';
import 'boxicons'
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Badge, Icon, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Link } from 'react-router-dom';
import ResponsiveNavbar from './ResponsiveNavbar'
import { useState } from 'react';
import Login from '../../Components/LiginForm/Login'

export default function SearchAppBar() {
  let [show, setShow] = useState(false);
  let [login, setLogin] = useState(false);
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.login-nav')) {
      setShow(false);
    }
  });



  return (
    <>
      {
        login && <Login props={true} />
      }
      <Stack flexWrap={'wrap'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ backgroundColor: 'inherit' }}>
        <Link to={'/'} sx={{ padding: '20px 0' }}>
          <img style={{ width: '80px', height: '118px' }} src="https://cdnfa.com/shikomod/dfb3/uploads/shiko-aoatar.png" alt="" />
        </Link>
        <TextField
        size='small'
          placeholder='جستجوی محصول,دسته,برند...'
          sx={{
            "& focus":{
              border:'none !important'
            },
            // Root class for the input field
            "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",
              // fontWeight: "bold",
              // Class for the border around the input field
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
                borderWidth: "0px",
                borderRadius:'15px',
              },
            },
            // Class for the label of the input field
            "& .MuiInputLabel-outlined": {
              color: "#2e2e2e",
              fontWeight: "bold",
            },
            width: '25vw' ,
             backgroundColor:"#f3f3f3",
             borderRadius:'10px'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}/>
        <Stack direction={'row'} sx={{ flexWrap: 'nowrap', padding: '20px 0' }} position={'relative'}>
          <Stack className='login-nav' sx={{ cursor: 'pointer' ,transition:'all .5s'}} direction={'row'} alignItems={'center'} justifyContent={'center'} onClick={() => { setShow(!show) }}>
            <PermIdentityIcon sx={{ borderRight: '2px solid #686e74', width: '40px', height: '40px', padding: '0 5px' }} />
            <Typography sx={{ padding: '0 0 0 15px' }} variant="body1">ورود/ثبت نام</Typography>
            <Stack overflow={'hidden'} className='login-nav' height={show ? '142px' : '0'} fontSize={'10px'} boxShadow={'0 0 5px 0 #686e74'} borderRadius={'10px'} width={'200px'}  bgcolor={'#fff'} position={'absolute'} top={'80px'} left={0} zIndex={50} sx={{transition:'all .5s'}}>
              <Stack onClick={() => { setLogin(!login) }} className='login-item' padding={'15px 15px 10px 15px'} direction={'row'} justifyContent={'start'} alignItems={'center'}>
                <box-icon name='log-in'></box-icon>
                <Typography>ورود</Typography>
              </Stack>
              <Link to={'/login-register'} className='login-item' style={{ display: 'flex', padding: '10px 15px 10px 15px', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }} padding={'10px 15px 10px 15px'} direction={'row'} justifyContent={'start'} alignItems={'center'}>
                <box-icon name='user-plus'></box-icon>
                <Typography>ثبت نام</Typography>
              </Link>
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
            <Link to={'/bag'}>کیف</Link>
        </ListItem>
        <ListItem>
          <Link to={'/shoe'}>کفش</Link>
        </ListItem>
        <ListItem>
          <Link to={'/wear'}>پوشاک</Link>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <box-icon type='solid' name='book-alt'></box-icon>
          </ListItemIcon>
          <Link to={'web-log'}>مجله تخصصی کیف و کفش</Link>
        </ListItem>
        <ListItem>
          <Link to={'/special-sale'}>حراج ویژه</Link>
        </ListItem>
        <ListItem>
          <ResponsiveNavbar />
        </ListItem>
      </List>
    </>
  );
}
