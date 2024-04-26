import React, { useEffect, useState } from 'react'
import Slider from '../../Components/Slider'
import { Box, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, Stack, Switch, TextField, Typography, useMediaQuery } from '@mui/material'
import Card from '../../Components/Card'
import FetchApi from '../../Utils/FetchApi'
import PrSlider from '../../Components/PrSlider'
import { Margin } from '@mui/icons-material'

export default function Shoe() {
  const [shoes, setShoes] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchApi(`${process.env.REACT_APP_BASE_API}/products?pagination[pageSize]=5000&populate=*`);
        const filteredShoes = data?.data?.filter((e) => {
          return e?.attributes?.shoe?.data !== null;
        })
        setShoes(filteredShoes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);
  const isMobile = useMediaQuery('max-width:600px')
  const [brand, setBrand] = React.useState("شيكو");

  const handleChange = (event) => {
    setBrand(event.target.value);
  };
  return (
    <Stack direction={'row'}>
      <Stack gap={2} p={3} justifyContent={'start'} width={'25%'}>
        <Typography component={'h2'} variant='h3' fontSize={'1.4rem'}>فیلتر</Typography>
        <Stack direction={'column'} marginTop={1} gap={1}>
          <Typography>جستجو در نتایج</Typography>
          <TextField
            placeholder='جستجو...'
          />
        </Stack>
        <Stack gap={1}>
          <FormControl>
            <FormLabel component="legend">برند</FormLabel>
            <Select value={brand} fullWidth onChange={handleChange}>
              <MenuItem value="شيكو">شيكو</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={'column'} justifyContent={'start'} bgcolor={'#f2f3f5'} borderRadius={'5px'} border={'1px solid #dbdbdb'}>

        </Stack>
        <Box>
          <FormLabel component="legend">فقط آیتمهای موجود</FormLabel>
          <Switch defaultChecked />
        </Box>
        <Box>
          <FormLabel component="legend">فقط آیتمهای تخفیف دار</FormLabel>
          <Switch />
        </Box>
        <Box>
          <FormLabel component="legend">فقط آیتم های ویژه</FormLabel>
          <Switch />
        </Box>
      </Stack>



      <Box padding={'30px 0'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} width={'75%'}>
        <Stack direction={'row'} width={'100%'} flexWrap="wrap" justifyContent={'space-between'} gap={1}>
          {shoes &&
            shoes.map((e, index) => (
              <Box width={'24%'}>
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
  )
}
