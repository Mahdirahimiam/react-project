import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import ImageLightBox from '../../Components/ImageLightBox';
import FetchApi from '../../Utils/FetchApi';
import Star from '../../Components/Star';

export default function Index() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const urls = product && product.Imgs && product.Imgs.data ?
    product.Imgs.data.map((e) => `${process.env.REACT_APP_BASE_URL}${e.attributes.url}`) : [];

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products/${slug}?populate=*`);
        if (data) {
          setProduct(data?.data?.attributes);
          const productColors = data?.data?.attributes?.Details?.colors?.replace('[', '').replace(']', '').split(',').map((e) => e.trim());
          const productSizes = data?.data?.attributes?.Details?.size?.replace('[', '').replace(']', '').split(',').map((e) => e.trim());
          setColors(productColors || []);
          setSizes(productSizes || []);
          setSelectedColor(productColors[0] || '');
          setSelectedSize(productSizes[0] || '');
        }
      } catch (error) {
        console.log("data error ="+error);
      }
    }
    fetchData();
  }, [slug]);

  const handleColorChange = (event) => {
    const value = event.target.value;
    if (colors.includes(value)) {
      setSelectedColor(value);
    }
  };

  const handleSizeChange = (event) => {
    const value = event.target.value;
    if (sizes.includes(value)) {
      setSelectedSize(value);
    }
  };

  return (
    colors.length > 0 && (
      <Stack py={3} gap={3} direction={'row'} justifyContent={'space-between'} paddingTop={'30px'}>
        {/* //product image */}
        <Box height={'80%'} width={'26%'}>
          <ImageLightBox urls={urls} />
        </Box>
        {/* //product details */}
        <Stack width={'47%'} direction={'column'} gap={1} justifyContent={'start'} alignItems={'start'}>
          <Typography padding={'10px 0'} width={'100%'} variant='h5' borderBottom={'1px solid #dadada'}>{product?.Name}</Typography>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} gap={2}>
            <Typography> دیدگاه کاربران</Typography>
            <Box>
              <Star rate={product?.Rate / 20} />
            </Box>
          </Stack>
          <Stack direction={'column'}>
            <Typography>کد کالا: {slug}</Typography>
            <Typography style={{ whiteSpace: 'pre-wrap' }}>{product?.Desc}</Typography>
          </Stack>
        </Stack>
        {/* //product cart */}
        <Stack sx={{ backgroundColor: 'rgb(235, 235, 235)' }} alignItems={'center'} justifyContent={'center'} gap={1} direction={'column'} border={'1px solid #dadada'} borderRadius={'10px'} width={'23%'} height={''}>
          <Stack width={'90%'} direction={'row'} gap={1} marginTop={'10px'} borderBottom={'1px solid #dadada'} paddingBottom={'10px'}>
            <box-icon name='calendar-check' color='#b39426'></box-icon>
            <Typography>موجود در انبار</Typography>
          </Stack>
          <Stack width={'90%'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography>قیمت کالا</Typography>
            <Stack fontSize={'14px'} direction={'column'}>
              <Box visibility={product?.Discount ? 'visible' : 'hidden'}>
                <span style={{ fontSize: '14px', color: '#fff', backgroundColor: 'red', textDecoration: 'line-through !important', borderRadius: '5px', padding: '0 3px' }}>{product?.Discount}%</span>
                <span className='discount' style={{ padding: '0 15px', fontSize: '14px', color: 'var(--fontColor)' }}>{product?.DiscountPrice}</span>
              </Box>
              <Typography>{product?.Price} <span style={{ color: '#545353' }}>تومان</span></Typography>
            </Stack>
          </Stack>
          <Stack gap={1} width={'90%'} direction={'column'} justifyContent={'right'}>
            <FormControl sx={{display:colors.length>0?'block':"none"}}>
              <FormLabel component="legend">رنگ</FormLabel>
              <Select value={selectedColor} fullWidth onChange={handleColorChange} sx={{ fontSize: '.9rem' }}>
                {colors.map((e) => (
                  <MenuItem key={e} value={e}>{e}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack gap={1} width={'90%'} direction={'column'} justifyContent={'right'}>
            <FormControl sx={{display:sizes.length>0?"block":"none"}}>
              <FormLabel component="legend">سایز</FormLabel>
              <Select value={selectedSize} fullWidth onChange={handleSizeChange} sx={{ fontSize: '.9rem' }}>
                {sizes.map((e) => (
                  <MenuItem key={e} value={e}>{e}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Button variant='contained' sx={{ width: '90%', backgroundColor: '#fb3449', margin: '20px 0' }}>
            <Typography>افزودن به سبد خرید</Typography>
          </Button>
        </Stack>
      </Stack>
    )
  )
}