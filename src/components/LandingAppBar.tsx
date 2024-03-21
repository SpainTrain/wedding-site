import * as React from 'react'
import { Paper } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

export const LandingAppBar = () => (
  <Paper elevation={5}>
    <Container maxWidth="xl">
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h2"
          noWrap
          component="div"
          sx={{ paddingTop: 1, paddingBottom: 1 }}
        >
          {'H & M'}
        </Typography>
      </Toolbar>
    </Container>
  </Paper>
)
