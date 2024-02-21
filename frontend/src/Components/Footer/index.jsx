import { Box, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React from 'react'

export default function Footer() {
  return (
    <>
      <List>
        <ListItem>
          <ListItemText>
            خدمات مشتریان
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
          پیگیری سفارش
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
          قوانین و مقررات
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemSecondaryAction>
            <ListItemText>
            ثبت شکایات در سایت
            </ListItemText>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  )
}
