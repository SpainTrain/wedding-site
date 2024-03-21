import * as React from 'react'
import {
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  Divider,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

import { Menu as MenuIcon } from '@mui/icons-material'
import { renderIf } from '../../render-if'
import { size } from 'lodash'

interface Props<TPage extends string> {
  onLogout: () => void
  photoURL?: string
  displayName: string
  onChangeGuest: (guestId: string) => void
  otherGuestsSameEmail: ReadonlyArray<{
    displayName: string
    guestId: string
  }>
  pages: Array<TPage>
  activePage: TPage
  onChangeActivePage: (page: TPage) => void
}

export const GuestAppBar = <TPage extends string>({
  onLogout: handleLogout,
  onChangeActivePage: handleChangeActivePage,
  photoURL,
  displayName,
  otherGuestsSameEmail,
  onChangeGuest,
  pages,
  activePage,
}: Props<TPage>) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = React.useCallback(() => {
    setAnchorElNav(null)
  }, [])

  const handleCloseUserMenu = React.useCallback(() => {
    setAnchorElUser(null)
  }, [])

  const handleNav = React.useCallback(
    (page: TPage) => {
      handleChangeActivePage(page)
      handleCloseNavMenu()
    },
    [handleChangeActivePage, handleCloseNavMenu]
  )

  const handleTabNav = React.useCallback(
    (event, page: TPage) => {
      handleNav(page)
    },
    [handleNav]
  )

  const handleChangeGuest = React.useCallback(
    (guestId: string) => () => {
      onChangeGuest(guestId)
      handleCloseUserMenu()
    },
    [onChangeGuest, handleCloseUserMenu]
  )

  const handleChangeAvatar = React.useCallback(() => {
    window.open('https://en.gravatar.com/', '_blank')
  }, [])

  return (
    <Paper>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            {'H&M'}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  disabled={page === activePage}
                  onClick={() => handleNav(page)}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tabs value={activePage} onChange={handleTabNav}>
              {pages.map((page) => (
                <Tab key={page} label={page} value={page} />
              ))}
            </Tabs>
          </Box>

          <Box
            sx={{
              flexGrow: 0,
            }}
          >
            <Typography
              component="span"
              sx={{ mr: 1, verticalAlign: 'middle' }}
            >
              {displayName}
            </Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={displayName} src={photoURL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleChangeAvatar}>
                <Typography textAlign="center">{'Update Avatar'}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">{'Logout'}</Typography>
              </MenuItem>

              {renderIf(size(otherGuestsSameEmail) > 0)(() => (
                <Divider>{'Switch Guest'}</Divider>
              ))}

              {otherGuestsSameEmail.map(({ displayName, guestId }) => (
                <MenuItem key={guestId} onClick={handleChangeGuest(guestId)}>
                  <Typography textAlign="center">{displayName}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </Paper>
  )
}
