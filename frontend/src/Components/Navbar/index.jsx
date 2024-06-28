import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import 'boxicons';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Badge, Icon, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveNavbar from './ResponsiveNavbar';
import { useState } from 'react';
import Login from '../../Components/LiginForm/Login';
import FetchApi from '../../Utils/FetchApi';

export default function SearchAppBar() {
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products?pagination[pageSize]=5000&populate=*`);
      setProducts(data?.data);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (search) {
      const filteredItems = products?.filter((e) => {
        return e.attributes.Name.toLowerCase().includes(search.toLowerCase());
      });
      setSearchResult(filteredItems);
    } else {
      setSearchResult([]);
    }
  }, [search, products]);

  const handleWindowClick = (e) => {
    if (!e.target.closest('.login-nav')) {
      setShow(false);
    }
    if (!e.target.closest('.searchModal')) {
      setShowModal(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);
  const navigate = useNavigate()
  return (
    <>
      {
        login && <Login props={true} />
      }
      <Stack flexWrap={'wrap'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ backgroundColor: 'inherit' }}>
        <Link to={'/'} sx={{ padding: '20px 0' }}>
          <img style={{ width: '80px', height: '118px' }} src="https://cdnfa.com/shikomod/dfb3/uploads/shiko-aoatar.png" alt="" />
        </Link>
        <Stack direction={'column'} position={'relative'}>
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowModal(true)
            }}
            size='small'
            placeholder='جستجوی محصول,دسته,برند...'
            sx={{
              "& focus": {
                border: 'none !important'
              },
              "& .MuiOutlinedInput-root": {
                color: "#000",
                fontFamily: "Arial",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray",
                  borderWidth: "0px",
                  borderRadius: '15px',
                },
              },
              "& .MuiInputLabel-outlined": {
                color: "#2e2e2e",
                fontWeight: "bold",
              },
              width: '25vw',
              backgroundColor: "#f3f3f3",
              borderRadius: '10px'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }} />
          <Stack className='searchModal' mt={1} display={showModal ? 'block' : 'none'} p={.5} maxHeight={'300px'} zIndex={50} position={'absolute'} top={'100%'} overflow={'scroll'} width={'100%'} gap={1} border={'1px #dbdbdb solid'} borderRadius={'5px'} bgcolor={'#fff'} direction={'column'} alignItems={'start'} justifyContent={'start'} sx={{ transition: "all linear .5" }}>
            {searchResult?.map((e, index) => (
              <Stack my={1} justifyContent={'space-between'} key={index} direction={'row'} alignItems={'center'} borderRadius={'5px'} p={1} bgcolor={'#dedede'} width={'100%'}>
                <Link onClick={() => {
                  setShowModal(false)
                  setSearch('')
                }} to={`/product-details/` + e.id}>{e?.attributes?.Name}</Link>
                <img className='image-search' src={process.env.REACT_APP_BASE_URL + e?.attributes?.Imgs?.data[0].attributes.url} />
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack direction={'row'} sx={{ flexWrap: 'nowrap', padding: '20px 0' }} position={'relative'}>
          <Stack className='login-nav' sx={{ cursor: 'pointer', transition: 'all .5s' }} direction={'row'} alignItems={'center'} justifyContent={'center'} onClick={() => { setShow(!show) }}>
            <PermIdentityIcon sx={{ borderRight: '2px solid #686e74', width: '40px', height: '40px', padding: '0 5px' }} />
            <Typography sx={{ padding: '0 0 0 15px' }} variant="body1">ورود/ثبت نام</Typography>
            <Stack overflow={'hidden'} className='login-nav' height={show ? '142px' : '0'} fontSize={'10px'} boxShadow={'0 0 5px 0 #686e74'} borderRadius={'10px'} width={'200px'} bgcolor={'#fff'} position={'absolute'} top={'80px'} left={0} zIndex={50} sx={{ transition: 'all .5s' }}>
              <Stack onClick={() => { setLogin(!login) }} className='login-item' padding={'15px 15px 10px 15px'} direction={'row'} justifyContent={'start'} alignItems={'center'}>
                <box-icon name='log-in'></box-icon>
                <Typography>ورود</Typography>
              </Stack>
              <Link to={'/login-register'} className='login-item' style={{ display: 'flex', padding: '10px 15px 10px 15px', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
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
          <Badge
          onClick={()=>{navigate('/cart')}}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',cursor:"pointer" }}
            badgeContent={(  []).length}
            color="success"
          >
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
          <Link to={'/special-sale'}>حراج ویژه</Link>
        </ListItem>
      </List>
    </>
  );
}
