import { Box, List, ListItem, ListItemSecondaryAction, ListItemText, Stack, Typography } from '@mui/material'
import React from 'react'

export default function Footer() {
  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Stack direction={'row'} sx={{ flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{fontWeight:'bold'}} variant='body1' component={'p'}>
              خدمات مشتریان
            </Typography>
            <Typography>پیگیری سفارش</Typography>
            <Typography>قوانین و مقررات</Typography>
            <Typography>ثبت شکایات در سایت</Typography>
          </Box>

          <Box>
            <Typography sx={{fontWeight:'bold'}} variant='body1' component={'p'}>
فروشگاه
            </Typography>
            <Typography>درباره ما</Typography>
            <Typography>تماس با ما</Typography>
            <Typography>نقشه سایت</Typography>
          </Box>
        </Stack>
        <Box>
        </Box>
      </Stack>
    </>
  )
}
