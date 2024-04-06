import { Box, List, ListItem, ListItemSecondaryAction, ListItemText, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <Stack>
        <Stack>
          <Stack flexWrap={'wrap'} direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
            <Stack width={'50%'} direction={'row'} sx={{ flexWrap: 'wrap' }} mt={3}>
              <Box>
                <Typography sx={{ fontWeight: 'bold' }} variant='body1' component={'p'}>
                  خدمات مشتریان
                </Typography>
                <Typography p={.6} color={'#606060'} >پیگیری سفارش</Typography>
                <Typography p={.6} color={'#606060'} >قوانین و مقررات</Typography>
                <Typography p={.6} color={'#606060'} >ثبت شکایات در سایت</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 'bold' }} variant='body1' component={'p'}>
                  فروشگاه
                </Typography>
                <Typography p={.6} color={'#606060'}>درباره ما</Typography>
                <Typography p={.6} color={'#606060'}>تماس با ما</Typography>
                <Typography p={.6} color={'#606060'}>نقشه سایت</Typography>
              </Box>
            </Stack>
            <Stack width={'50%'} justifyContent={'center'} mt={3}>
              <Typography textAlign={'center'}>مارا در شبکه های اجتماعی دنبال کنید :</Typography>
              <Stack direction={'row'} justifyContent={'center'}>
                <box-icon type='logo' size='md' name='instagram' color='#e0646c'></box-icon>
                <box-icon type='logo' size='md' name='telegram' color='#2da5e1'></box-icon>
                <box-icon type='logo' size='md' name='whatsapp' color='#01e675'></box-icon>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Link to={''} style={{ display: 'flex', flexDirection: 'row', border: '1px #dadada solid', padding: '0 5px', borderRadius: '10px', alignItems: 'center', justifyContent: "center" }} >
            <Typography>دانلود مستقیم</Typography>
            <box-icon size='md' name='android' type='logo' color='#00fa0c' ></box-icon>
          </Link>
        </Stack>
      </Stack>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} padding={'20px 0'}>
        <Link to={'/'} sx={{ padding: '20px 0' }}>
          <img style={{ width: '80px', height: '118px' }} src="https://cdnfa.com/shikomod/dfb3/uploads/shiko-aoatar.png" alt="" />
        </Link>
        <Box sx={{ width: '90%', height: '1px', borderRadius: '5px', backgroundColor: '#717171' }}></Box>
      </Stack>
      <Stack direction={'row'} padding={'20px 0'}>
        <Stack width={'70%'}>
          <Typography>فروشگاه شیکو با بیش از 12 سال سابقه فروش در حوزه کیف و کفش زنانه فعالیت دارد که هدف این مجموعه ارائه ی محصولاتی با کیفیت و قیمت مناسب بوده که در این راستا تولیدی شیکو هم به مجموعه اضافه شده تا محصولاتی منحصر به فرد و با ضمانت به مشتریان عرضه گردد .</Typography>
          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <box-icon name='mobile-alt' color='#105731'></box-icon>
            <Typography fontWeight={'510'} color={'#105731'}>شماره تماس : </Typography>
            <Typography fontSize={'1.1rem'} component={'a'} type='tel' color={'#105731'} href='tel:02191305222'>02191305222</Typography>
          </Stack>
          <Stack direction={'row'} gap={1}>
            <box-icon name='location-plus' color='#105731'></box-icon>
            <Typography fontWeight={'510'} fontSize={'1.1rem'} color={'#105731'}>نشانی : دفتر فروش اینترنتی : اندیشه فاز 3 خیابان چمران جنوبی نبش بن بست چهارم پلاک 169 | شعبه حضوری : تهران میدان تجریش مرکز خرید تندیس طبقه منفی 2 واحد 43 روبه روی پله برقی</Typography>
          </Stack>
          <Typography>همه روزه از 11 الی 22 </Typography>

        </Stack>
        <Stack width={'30%'}alignItems={'end'} justifyContent={'center'}>
          <img style={{width:'100px',height:'100px',border:'1px #dadada solid', borderRadius:'20px'}} src='https://www.webramz.com/wp-content/uploads/2018/10/000.jpg' alt='etemed' />
        </Stack>
      </Stack>
    </>
  )
}
