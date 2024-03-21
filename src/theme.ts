import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { red } from '@mui/material/colors'
import type {} from '@mui/x-data-grid-pro/themeAugmentation'

// Create a theme instance.
export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#5a6bb2',
      },
      secondary: {
        main: '#e15430',
      },
      text: {
        primary: 'rgba(55,70,113,0.85)',
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      fontFamily: "'Josefin Sans', sans-serif",
      body1: {
        fontFamily: "'Dosis', 'Josefin Sans', sans-serif",
        fontSize: '1.25rem',
      },
      body2: {
        fontFamily: "'Raleway', 'Josefin Sans', sans-serif",
        fontSize: '1.1rem',
      },
      h1: {
        fontFamily: "'Birthstone Bounce', cursive",
      },
      h2: {
        fontFamily: "'Berkshire Swash', cursive",
      },
      h3: {
        fontFamily: "'Yuji Syuku', serif",
      },
      h4: {
        fontFamily: "'Yuji Syuku', serif",
      },
      h5: {
        fontFamily: "'Yuji Syuku', serif",
      },
      h6: {
        fontFamily: "'Berkshire Swash', cursive",
      },
    },
  })
)
