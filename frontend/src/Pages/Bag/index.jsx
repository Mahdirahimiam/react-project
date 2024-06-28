import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, MenuItem, Select, Slider, Stack, Switch, TextField, Typography, useMediaQuery } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Card from '../../Components/Card';
import FetchApi from '../../Utils/FetchApi';
import { Link } from 'react-router-dom';

function valuetext(value) {
  return `${value}°C`;
}

export default function Shoe() {
  const [bags, setBags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(1000000);
  const [price, setPrice] = useState([minPrice, maxPrice]);
  const [brand, setBrand] = useState("شيكو");
  const [off, setOff] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const isMobile = useMediaQuery('max-width:600px');

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products?pagination[pageSize]=5000&populate=*`);
        const filteredbags = data?.data?.filter((e) => {
          return e?.attributes?.Category == 'bag';
        });
        setBags(filteredbags);
        if (filteredbags.length > 0) {
          const prices = filteredbags.map((e) => +e.attributes.Price);
          setMaxPrice(Math.max(...prices));
          setMinPrice(Math.min(...prices));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setPrice([minPrice, maxPrice]);
    })();
  }, [minPrice,maxPrice]);

  const handleChange = (event) => {
    setBrand(event.target.value);
  };

  const handleChangeSlider = (event, newValue) => {
    setPrice(newValue);
  };

  useEffect(() => {
    if (search) {
      const filteredItems = bags?.filter((e) => {
        return e.attributes.Name.toLowerCase().includes(search.toLowerCase());
      });
      setSearchResult(filteredItems);
    } else {
      setSearchResult([]);
    }
  }, [search, bags]);
  const [showModal,setShowModal] = useState(false)
  window.addEventListener("click",(e)=>{
    if(!e.target.closest(".searchModal")){
      setShowModal(false)
    }
  })
  return (
    <Stack direction='row'>
      <Stack gap={2} p={3} justifyContent='start' width='25%'>
        <Typography component='h2' variant='h3' fontSize='1.4rem'>فیلتر</Typography>
        <Stack position={'relative'}>
          <Stack direction='column' marginTop={1} gap={1}>
            <Typography>جستجو در نتایج</Typography>
            <TextField value={search} onChange={(e) => { 
              setSearch(e.target.value) 
              setShowModal(true) }} placeholder='جستجو...' />
          </Stack>
          <Stack className='searchModal' display={showModal?'block':'none'} p={.5} maxHeight={'300px'} zIndex={50} position={'absolute'} top={'100%'} overflow={'scroll'} width={'100%'} gap={1} border={'1px #dbdbdb solid'} borderRadius={'5px'} bgcolor={'#fff'} direction={'column'} alignItems={'start'} justifyContent={'start'} sx={{transition:"all linear .5"}}>
            {searchResult.map((e, index) => (
              <Stack my={1} justifyContent={'space-between'} key={index} direction={'row'} alignItems={'center'} borderRadius={'5px'} p={1} bgcolor={'#dedede'} width={'100%'}>
                <Link to={`/product-details/`+e.id}>{e?.attributes?.Name}</Link>
                <img className='image-search' src={process.env.REACT_APP_BASE_URL + e?.attributes?.Imgs?.data[0].attributes.url} />
              </Stack>
            ))}
          </Stack>
        </Stack>
        <FormControl>
          <FormLabel component="legend">برند</FormLabel>
          <Select value={brand} fullWidth onChange={handleChange}>
            <MenuItem value="شيكو">شيكو</MenuItem>
          </Select>
        </FormControl>
        <Stack gap={1} p={2} direction='column' alignItems='center' justifyContent='center' bgcolor='#f2f3f5' borderRadius='5px' border='1px solid #dbdbdb'>
          <Typography variant=''>محدوده قیمت مورد نظر</Typography>
          <Slider
            getAriaLabel={() => "price"}
            value={price}
            step={50}
            min={minPrice}
            max={maxPrice}
            onChange={handleChangeSlider}
            valueLabelDisplay="auto"
          />
          <Stack gap={.5} direction='row' alignItems='center' justifyContent='center'>
            <TextField onChange={(e) => { setPrice([price[0], +e.target.value]) }} inputProps={{ style: { textAlign: 'center' } }} placeholder={maxPrice} sx={{ width: '40%' }} variant='outlined' />
            <CompareArrowsIcon />
            <TextField onChange={(e) => { setPrice([+e.target.value, price[1]]) }} inputProps={{ style: { textAlign: 'center' } }} placeholder={minPrice} sx={{ width: '40%' }} variant='outlined' />
          </Stack>
        </Stack>
        <Stack p={1.5} border='1px #dbdbdb solid' bgcolor='#f2f3f5' borderRadius='5px' direction='row' width='100%' alignItems='center' justifyContent='space-between'>
          <FormLabel component="legend">فقط آیتمهای تخفیف دار</FormLabel>
          <Switch onClick={() => { setOff(!off) }} />
        </Stack>
      </Stack>
      <Box padding='30px 0' display='flex' flexDirection='row' flexWrap='wrap' width='75%'>
        <Stack direction='row' width='100%' flexWrap="wrap" justifyContent='' gap={1.5}>
          {bags &&
            bags.map((e, index) => (
              <Box sx={{ display: off && !e.attributes.DiscountPrice || e.attributes.Price < price[0] || e.attributes.Price > price[1] ? 'none' : 'block' }} key={index} width='24%'>
                <Card
                  discount={e.attributes.Discount}
                  discountPrice={e.attributes.DiscountPrice}
                  id={e.id}
                  image={e.attributes.Imgs.data[0].attributes.url}
                  price={e.attributes.Price}
                  title={e.attributes.Name}
                  isOff={e.attributes.IsOff}
                  is100={isMobile ? true : false}
                />
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Stack>
  );
}
