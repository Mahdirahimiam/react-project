import React, { useEffect, useState } from 'react';
import Slider from '../../Components/Slider';
import { Box, Stack, Typography } from '@mui/material';
import PrSlider from '../../Components/PrSlider';
import FetchApi from '../../Utils/FetchApi';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [wear, setWear] = useState([]);
  const [bag, setBag] = useState([]);
  const [shoe, setShoe] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products?pagination[pageSize]=5000&populate=*`);
        setProducts(data?.data);

        const wear = data?.data?.filter((e) => e?.attributes?.Category === 'wears');
        const shoe = data?.data?.filter((e) => e?.attributes?.Category === 'shoes');
        const bag = data?.data?.filter((e) => e?.attributes?.Category === 'bag');

        setWear(wear);
        setShoe(shoe);
        setBag(bag);
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
          <Typography>پوشاک</Typography>
          <Box sx={{ width: '80%', height: '1px', borderRadius: '5px', backgroundColor: '#717171' }}></Box>
          <Typography sx={{cursor:"pointer"}} onClick={() => navigate('/wear')}>مشاهده همه</Typography>
          <Box></Box>
        </Box>
        <PrSlider products={wear} />
        
        <Box width={'100%'} height={'5vw'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box sx={{ width: '2vw', height: '.3vw', backgroundColor: 'green', borderRadius: '5px' }}></Box>
          <Typography>کیف</Typography>
          <Box sx={{ width: '80%', height: '1px', borderRadius: '5px', backgroundColor: '#717171' }}></Box>
          <Typography sx={{cursor:"pointer"}} onClick={() => navigate('/bag')}>مشاهده همه</Typography>
          <Box></Box>
        </Box>
        <PrSlider products={bag} />
        
        <Box width={'100%'} height={'5vw'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box sx={{ width: '2vw', height: '.3vw', backgroundColor: 'green', borderRadius: '5px' }}></Box>
          <Typography>کفش</Typography>
          <Box sx={{ width: '80%', height: '1px', borderRadius: '5px', backgroundColor: '#717171' }}></Box>
          <Typography sx={{cursor:"pointer"}} onClick={() => navigate('/shoe')}>مشاهده همه</Typography>
          <Box></Box>
        </Box>
        <PrSlider products={shoe} />
        
        <Stack gap={'10px'} direction={'column'} width={'100%'} >
          <Box height={'40vh'} borderRadius={'20px'} overflow={'hidden'} width={'100%'}>
            <img style={{ width: '100%', height: '100%' }} src='https://cdnfa.com/shikomod/dfb3/uploads/6.jpg' alt='shiko picture' />
          </Box>
          <Stack gap={'10px'} direction={'row'} overflow={'hidden'}>
            <img style={{ borderRadius: '25px', width: '50%' }} src='https://cdnfa.com/shikomod/dfb3/uploads/s.jpg' alt='shiko picture' />
            <img style={{ borderRadius: '25px', width: '50%' }} src='https://cdnfa.com/shikomod/dfb3/uploads/benz.jpg' alt='shiko picture' />
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
