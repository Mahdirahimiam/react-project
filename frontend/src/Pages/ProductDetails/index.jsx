import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import SelectBox from '../../Components/SelectBox';
import { useParams } from 'react-router-dom';
import ImageLightBox from '../../Components/ImageLightBox'
import FetchApi from '../../Utils/FetchApi'
import Star from '../../Components/Star'
export default function Index() {
  const params = useParams();
  const [product, setProduct] = useState()
  const urls = product && product.Imgs && product.Imgs.data ?
    product.Imgs.data.map((e) => `${process.env.REACT_APP_BASE_URL}${e.attributes.url}`) : [];



  useEffect(() => {
    (async () => {
      try {
        const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products/${params.slug}?populate=*`);
        if (data) {
          setProduct(data.data.attributes);
        }
      } catch (error) {
        console.log(error);
      }
    })()
  }, [params.slug]);


  
  const colors = product?.Details.colors.replace('[','').replace(']','').split(',').map((e) => e.trim());
  const sizes = product?.Details.size.replace('[','').replace(']','').split(',').map((e) => e.trim());

   return (
    product && (
      <Stack spacing={1} direction={'row'}>
        {/* //product image */}
        <Box height={'80vh'} width={'30%'}>
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
            <Typography>کد کالا: {params?.slug}</Typography>
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
                <Box visibility={product?.Discount?'visible':'hidden'}>
                  <span style={{ fontSize: '14px', color: '#fff', backgroundColor: 'red', textDecoration: 'line-through !important', borderRadius: '5px', padding: '0 3px' }}>{product?.Discount}%</span>
                  <span className='discount' style={{ padding: '0 15px', fontSize: '14px', color: 'var(--fontColor)' }}>{product?.DiscountPrice}</span>
                </Box>
              <Typography>{product?.Price} <span style={{ color: '#545353' }}>تومان</span></Typography>
            </Stack>
          </Stack>
          <Stack gap={1} width={'90%'} direction={'column'} justifyContent={'right'}>
            <Typography width={'100%'}>رنگ</Typography>
            <SelectBox title={'رنگ'} list={colors} />
          </Stack>
          <Stack gap={1} width={'90%'} direction={'column'} justifyContent={'right'}>
            <Typography width={'100%'}>سایز</Typography>
            <SelectBox title={'سایز'} list={sizes} />
          </Stack>
          <Button variant='contained' sx={{ width: '90%', backgroundColor: '#fb3449', margin: '20px 0' }}>
            <Typography>افزودن به سبد خرید</Typography>
          </Button>
        </Stack>
      </Stack>
    )
  );
}