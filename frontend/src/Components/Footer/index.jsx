import { Box, List, ListItem, ListItemSecondaryAction, ListItemText, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <Stack>
    <Stack>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Stack direction={'row'} sx={{ flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{fontWeight:'bold'}} variant='body1' component={'p'}>
              خدمات مشتریان
            </Typography>
            <Typography color={'#606060'} >پیگیری سفارش</Typography>
            <Typography color={'#606060'} >قوانین و مقررات</Typography>
            <Typography color={'#606060'} >ثبت شکایات در سایت</Typography>
          </Box>

          <Box>
            <Typography sx={{fontWeight:'bold'}} variant='body1' component={'p'}>
فروشگاه
            </Typography>
            <Typography color={'#606060'}>درباره ما</Typography>
            <Typography color={'#606060'}>تماس با ما</Typography>
            <Typography color={'#606060'}>نقشه سایت</Typography>
          </Box>
        </Stack>
        <Stack>
              <Typography>مارا در شبکه های اجتماعی دنبال کنید :</Typography>
              <Box>
              <box-icon type='logo' size='md' name='instagram' color='#e0646c'></box-icon>
              <box-icon type='logo' size='md' name='telegram' color='#2da5e1'></box-icon>
              <box-icon type='logo' size='md' name='whatsapp' color='#01e675'></box-icon>
              <box-icon type='logo' size='md' name='hand-up' color='#01e675'></box-icon>
              <box-icon name='android' type='logo' color='#00fa0c' ></box-icon>
              </Box>
        </Stack>
      </Stack>
    </Stack>
    <Box>
      <Link to={''} style={{display:'flex',flexDirection:'row'}}>
        <Typography>دانلود مستقیم</Typography>
        </Link>
    </Box>
    </Stack>
  )
}
