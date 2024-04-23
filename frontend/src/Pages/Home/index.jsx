import React, { useEffect, useState } from 'react'
import Slider from '../../Components/Slider'
import { Box, Stack, Typography } from '@mui/material'
import Card from '../../Components/Card'
import FetchApi from '../../Utils/FetchApi'
import PrSlider from '../../Components/PrSlider'
export default function Home() {
  const [products, setProducts] = useState()
  const [loafer, setLoafer] = useState()
  const [sandal, setSandal] = useState()
  const [offers, setOffers] = useState()
  const [vans, setVans] = useState()
  const [sneakers, setSneakers] = useState()
  const [purse, setPurse] = useState()
  const [boot, setBoot] = useState()
  const [article, setArticle] = useState()

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products?populate=*`);
        setProducts(data?.data);

        const loafer = data?.data?.filter((e) => {
          return e?.attributes?.shoe?.data?.attributes?.Name === 'loafer';
        });
        const sneakers = data?.data?.filter((e) => {
          return e?.attributes?.shoe?.data?.attributes?.Name === 'sneakers';
        });
        const sandal = data?.data?.filter((e) => {
          return e?.attributes?.shoe?.data?.attributes?.Name === 'Sandal';
        })
        setLoafer(loafer);
        setSneakers(sneakers);
        setSandal(sandal);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);
  return (
    <>
      <Slider />
      <Box padding={'30px 0'} display={'flex'} flexDirection={'column'}>

        <Box width={'100%'} height={'5vw'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box sx={{ width: '2vw', height: '.3vw', backgroundColor: 'green', borderRadius: '5px' }}></Box>
          <Typography>کالج</Typography>
          <Box sx={{ width: '80%', height: '1px', borderRadius: '5px', backgroundColor: '#717171' }}></Box>
          <Typography>مشاهده همه</Typography>
          <Box></Box>
        </Box>
        <PrSlider products={loafer} />
        <Box width={'100%'} height={'5vw'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box sx={{ width: '2vw', height: '.3vw', backgroundColor: 'green', borderRadius: '5px' }}></Box>
          <Typography>صندل</Typography>
          <Box sx={{ width: '80%', height: '1px', borderRadius: '5px', backgroundColor: '#717171' }}></Box>
          <Typography>مشاهده همه</Typography>
          <Box></Box>
        </Box>
        <PrSlider products={sandal}/>
        <Box width={'100%'} height={'5vw'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box sx={{ width: '2vw', height: '.3vw', backgroundColor: 'green', borderRadius: '5px' }}></Box>
          <Typography>کتونی</Typography>
          <Box sx={{ width: '80%', height: '1px', borderRadius: '5px', backgroundColor: '#717171' }}></Box>
          <Typography>مشاهده همه</Typography>
          <Box></Box>
        </Box>
        <PrSlider products={sneakers} />
        <Stack gap={'10px'} direction={'column'} width={'100%'} >
          <Box height={'40vh'} borderRadius={'20px'} overflow={'hidden'} width={'100%'}><img style={{ width: '100%', height: '100%' }} src='https://cdnfa.com/shikomod/dfb3/uploads/6.jpg' alt='shiko picture' /></Box>
          <Stack gap={'10px'} direction={'row'} overflow={'hidden'}>
            <img style={{ borderRadius: '25px', width: '50%' }} src='https://cdnfa.com/shikomod/dfb3/uploads/s.jpg' alt='shiko picture' />
            <img style={{ borderRadius: '25px', width: '50%' }} src='https://cdnfa.com/shikomod/dfb3/uploads/benz.jpg' alt='shiko picture' />
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
