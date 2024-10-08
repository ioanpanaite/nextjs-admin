// ** React Imports
import { ChangeEvent, Fragment, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import Radio from '@mui/material/Radio'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import RadioGroup from '@mui/material/RadioGroup'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Types
import { StatusType, UserProfileLeftType } from 'src/types/apps/chatTypes'

// ** Custom Component Imports
import Sidebar from 'src/@core/components/sidebar'
import { useSession } from 'next-auth/react'

const UserProfileLeft = (props: UserProfileLeftType) => {
  const {
    hidden,
    statusObj,
    userStatus,
    sidebarWidth,
    setUserStatus,
    userProfileLeftOpen,
    handleUserProfileLeftSidebarToggle
  } = props
  const { data: userProfile } = useSession()

  const handleUserStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setUserStatus(e.target.value as StatusType)
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  return (
    <Sidebar
      show={userProfileLeftOpen}
      backDropClick={handleUserProfileLeftSidebarToggle}
      sx={{
        zIndex: 9,
        height: '100%',
        width: sidebarWidth,
        borderTopLeftRadius: theme => theme.shape.borderRadius,
        borderBottomLeftRadius: theme => theme.shape.borderRadius,
        '& + .MuiBackdrop-root': {
          zIndex: 8,
          borderRadius: 1
        }
      }}
    >
      {userProfile && userProfile.user ? (
        <Fragment>
          <IconButton
            size='small'
            onClick={handleUserProfileLeftSidebarToggle}
            sx={{ top: '0.5rem', right: '0.5rem', position: 'absolute', color: 'text.disabled' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: 'column', p: theme => theme.spacing(11.25, 6, 4.5) }}>
            <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'center' }}>
              <Badge
                overlap='circular'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                badgeContent={
                  <Box
                    component='span'
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      color: `${statusObj[userStatus]}.main`,
                      backgroundColor: `${statusObj[userStatus]}.main`,
                      boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                    }}
                  />
                }
              >
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  src={userProfile.user.image}
                  alt={userProfile.user.fullName}
                />
              </Badge>
            </Box>
            <Typography variant='h5' sx={{ textAlign: 'center' }}>
              {userProfile.user.fullName}
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', textTransform: 'capitalize' }}>
              {userProfile.user.role}
            </Typography>
          </Box>

          <Box sx={{ height: 'calc(100% - 13.3125rem)' }}>
            <ScrollWrapper>
              <Box sx={{ p: 6 }}>
                <Typography
                  variant='body2'
                  sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase', lineHeight: 'normal' }}
                >
                  Status
                </Typography>
                <RadioGroup value={userStatus} sx={{ mb: 6, ml: 0.8 }} onChange={handleUserStatus}>
                  <div>
                    <FormControlLabel
                      value='online'
                      label='Online'
                      control={<Radio color='success' sx={{ p: 1.5 }} />}
                    />
                  </div>
                  <div>
                    <FormControlLabel value='away' label='Away' control={<Radio color='warning' sx={{ p: 1.5 }} />} />
                  </div>
                  <div>
                    <FormControlLabel
                      value='busy'
                      label='Do not Disturb'
                      control={<Radio color='error' sx={{ p: 1.5 }} />}
                    />
                  </div>
                  <div>
                    <FormControlLabel
                      value='offline'
                      label='Offline'
                      control={<Radio color='secondary' sx={{ p: 1.5 }} />}
                    />
                  </div>
                </RadioGroup>
                <Button variant='contained'>Logout</Button>
              </Box>
            </ScrollWrapper>
          </Box>
        </Fragment>
      ) : null}
    </Sidebar>
  )
}

export default UserProfileLeft
