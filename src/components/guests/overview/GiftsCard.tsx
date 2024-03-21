/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  Avatar,
  Button,
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

interface GiftsCardProps {
  nonAttendeeCopy?: boolean
}

export const GiftsCard = ({ nonAttendeeCopy = false }: GiftsCardProps) => {
  return (
    <Card>
      <CardHeader title="(No) Gift Information" />
      <CardContent>
        {nonAttendeeCopy ? (
          <Typography>
            {'We graciously request not to receive gifts.'}
          </Typography>
        ) : (
          <>
            <Typography>
              {'Short Version: Your gift is your presence!'}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              {
                'We are honored that you will travel to be with us, and request not to receive gifts.'
              }
            </Typography>
          </>
        )}
        <Divider sx={{ mt: 1 }} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          {
            'If you are a rebel who MUST break the "no gift" rule, here are some of our favorite charities that always need donations:'
          }
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              dense
              href="https://bfp.org/donate/"
              target="_blank"
            >
              <ListItemAvatar>
                <Avatar>
                  <img
                    alt="BFP"
                    width="48px"
                    src="https://media-exp1.licdn.com/dms/image/C560BAQG37DgEzvz9hA/company-logo_200_200/0/1554774036288?e=2147483647&v=beta&t=w7hEFUCBR94Gz4w40AAy4fjcOcLUYg6wldKpRV5CVqo"
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Beagle Freedom Project ➔" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              dense
              href="https://muttville.org/donate"
              target="_blank"
            >
              <ListItemAvatar>
                <Avatar>
                  <img
                    alt="BFP"
                    width="48px"
                    src="https://media-exp1.licdn.com/dms/image/C560BAQG7IILm2HFqLQ/company-logo_200_200/0/1580404817380?e=2147483647&v=beta&t=SqyaQa-0XAvLjtPEOK8M2jejnpBHFJhRJ8k0gbmBt_k"
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Muttville ➔" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              dense
              href="https://give.aldf.org/page/21315/donate/1"
              target="_blank"
            >
              <ListItemAvatar>
                <Avatar>
                  <img
                    alt="BFP"
                    width="48px"
                    src="https://aldf.org/wp-content/uploads/2018/05/ALDF_Logo_social-profile_color.png"
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Animal Legal Defense Fund ➔" />
            </ListItemButton>
          </ListItem>
        </List>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {
            'Alternatively, send via PayPal indicating the charity, and we can make the donation:'
          }
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
            href="https://paypal.me/Spainhower?country.x=US&locale.x=en_US"
            target="_blank"
          >
            {'PayPal'}
          </Button>
        </Typography>
      </CardContent>
    </Card>
  )
}
