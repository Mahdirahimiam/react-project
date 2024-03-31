import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import SelectBox from '../../Components/SelectBox';
import { useParams } from 'react-router-dom';
import ImageLightBox from '../../Components/ImageLightBox'
import FetchApi from '../../Utils/FetchApi'
export default function Index() {
  const params = useParams();
  const [product,setProduct]=useState()
  useEffect(() => {
    (async()=>{
      try {
        const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products/${params.slug}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })()
  })
  return (
    <Stack spacing={1} direction={'row'}>
{/* //product image */}
      <Box height={'80vh'} width={'30%'}>
        <ImageLightBox/>
      </Box>
{/* //product details */}
      <Stack width={'47%'} direction={'column'} gap={1} justifyContent={'start'} alignItems={'start'}>
        <Typography padding={'10px 0'} width={'100%'} variant='h5' borderBottom={'1px solid #dadada'}>{'نیم بوت جودون ایت 1392'}</Typography>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} gap={2}>
        <Box>
        <box-icon  name='star' color='#dadada'></box-icon>
        <box-icon name='star' color='#dadada'></box-icon>
        <box-icon name='star' color='#dadada'></box-icon>
        <box-icon name='star' color='#dadada'></box-icon>
        <box-icon name='star' color='#dadada'></box-icon>
        </Box>
        <Typography> دیدگاه کاربران</Typography>
        </Stack>
        <Stack>
          <Typography>کد کالا: {params?.slug}</Typography>
        </Stack>

      </Stack>
{/* //product cart */}
      <Stack sx={{ backgroundColor: 'rgb(235, 235, 235)' }} alignItems={'center'} justifyContent={'center'} gap={1} direction={'column'} border={'1px solid #dadada'} borderRadius={'10px'} width={'23%'} height={'50vh'}>
        <Stack width={'90%'} direction={'row'} gap={1} marginTop={'10px'} borderBottom={'1px solid #dadada'} paddingBottom={'10px'}>
          <box-icon name='calendar-check' color='#b39426'></box-icon>
          <Typography>موجود در انبار</Typography>
        </Stack>
        <Stack width={'90%'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography>قیمت کالا</Typography>
          <Stack fontSize={'14px'} direction={'column'}>
            <Typography><span style={{color:"#686e74",fontSize:'14px',textDecoration:"line-through"}}>395000</span> <span style={{ color: '#545353' }}>تومان</span></Typography>
            <Typography>{params?.slug} <span style={{ color: '#545353' }}>تومان</span></Typography>
          </Stack>
        </Stack>
        <Stack gap={1} width={'90%'} direction={'column'} justifyContent={'right'}>
          <Typography width={'100%'}>رنگ</Typography>
          <SelectBox title={'رنگ'} list={['ابی', 'بنفش', 'سبز']} />
        </Stack>
        <Stack gap={1} width={'90%'} direction={'column'} justifyContent={'right'}>
          <Typography width={'100%'}>سایز</Typography>
          <SelectBox title={'رنگ'} list={['41', '42', '43']} />
        </Stack>
        <Button variant='contained' sx={{ width: '90%', backgroundColor: '#fb3449', margin: '20px 0' }}>
          <Typography>افزودن به سبد خرید</Typography>
        </Button>
      </Stack>
    </Stack>
  );
}