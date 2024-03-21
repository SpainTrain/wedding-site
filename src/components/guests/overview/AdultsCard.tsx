/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'

export const AdultsCard = () => {
  return (
    <Card>
      <CardHeader title="Are children allowed?" />
      <CardContent>
        <Typography>
          {'Short Version: This is generally a grown-ups only affair.'}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {
            'With the exception of our ring bearer, our wedding ceremony and reception will be an adults-only event.'
          }
        </Typography>
        <Divider sx={{ mt: 1 }} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          {
            'If you are bringing children with you to the resort for the weekend and are in need of childcare, we recommend care.com, which runs background checks on all caregivers.'
          }
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton dense href="https://www.care.com/" target="_blank">
              <ListItemAvatar>
                <Avatar>
                  <img
                    alt="Care.com"
                    width="48px"
                    src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/rcvfacvsqgdhr4zgop8o"
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Care.com ➔" />
            </ListItemButton>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}
