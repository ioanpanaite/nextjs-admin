// ** React Imports
import { ChangeEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardHeader from '@mui/material/CardHeader'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateUser } from 'src/store/apps/user'
import { Snackbar } from '@mui/material'
import { SnackbarMessage } from 'src/types/apps/userTypes'

interface State {
  newPassword: string
  showNewPassword: boolean
  confirmNewPassword: string
  showConfirmNewPassword: boolean
}

interface DataType {
  icon: string
  color: string
  device: string
  browser: string
  location: string
  recentActivity: string
}

const data: DataType[] = [
  {
    color: 'info.main',
    location: 'Switzerland',
    device: 'HP Specter 360',
    icon: 'tabler:brand-windows',
    browser: 'Chrome on Windows',
    recentActivity: '10, July 2022 20:07'
  },
  {
    color: 'error.main',
    device: 'iPhone 12x',
    location: 'Australia',
    browser: 'Chrome on iPhone',
    icon: 'tabler:device-mobile',
    recentActivity: '13, July 2022 10:10'
  },
  {
    location: 'Dubai',
    color: 'success.main',
    device: 'OnePlus 9 Pro',
    icon: 'tabler:brand-android',
    browser: 'Chrome on Android',
    recentActivity: '4, July 2022 15:15'
  },
  {
    location: 'India',
    device: 'Apple IMac',
    color: 'secondary.main',
    icon: 'tabler:brand-apple',
    browser: 'Chrome on macOS',
    recentActivity: '20, July 2022 21:01'
  },
  {
    color: 'info.main',
    location: 'Switzerland',
    device: 'HP Specter 360',
    browser: 'Chrome on Windows',
    icon: 'tabler:brand-windows',
    recentActivity: '15, July 2022 11:15'
  },
  {
    location: 'Dubai',
    color: 'success.main',
    device: 'OnePlus 9 Pro',
    icon: 'tabler:brand-android',
    browser: 'Chrome on Android',
    recentActivity: '14, July 2022 20:20'
  }
]

const passwordCheck = (values: State, error: any) => {
  let errorStatus = false;
  if (values.newPassword !== values.confirmNewPassword) {
    error('Password is not matched correctly.')
    errorStatus = true
  } else if (values.newPassword.length < 8) {
    error('Password must be set over 8 letters.')
    errorStatus = true
  } else {
    error(null)
  }

  return errorStatus
}

const UserViewSecurity = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<State>({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false
  })

  const dispatch = useDispatch<AppDispatch>()

  // Handle Password
  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  // Handle Confirm Password
  const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleSubmitClick = async (e: any) => {
    e.preventDefault()
    const isError = passwordCheck(values, setError)
    const storedUser: string = window.localStorage.getItem('selected_user') as string || ''
    const user = JSON.parse(storedUser)

    if (!isError) {

      try {
        await dispatch(updateUser({ id: user.id, password: values.newPassword })).unwrap()
        setMessageInfo({ key: 'success', message: "Password changed successfully." })
        setOpen(true)
        setValues({ ...values, newPassword: '', confirmNewPassword: '' })
      } catch (error: any) {
        setMessageInfo({ key: 'error', message: error?.message })
        setOpen(true)
      }
    }
  }

  const handleClose = (event: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const handleExited = () => {
    setMessageInfo(undefined)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Change Password' />
          <CardContent>
            <Alert icon={false} severity='warning' sx={{ mb: 4 }}>
              {error ? error :
                (
                  <>
                    <AlertTitle
                      sx={{ fontWeight: 500, fontSize: '1.125rem', mb: theme => `${theme.spacing(2.5)} !important` }}
                    >
                      Ensure that these requirements are met
                    </AlertTitle>
                    Minimum 8 characters long, uppercase & symbol
                  </>
                )
              }
            </Alert>

            <form onSubmit={handleSubmitClick}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='New Password'
                    placeholder='············'
                    value={values.newPassword}
                    id='user-view-security-new-password'
                    onChange={handleNewPasswordChange('newPassword')}
                    type={values.showNewPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    placeholder='············'
                    label='Confirm New Password'
                    value={values.confirmNewPassword}
                    id='user-view-security-confirm-new-password'
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                            onClick={handleClickShowConfirmNewPassword}
                          >
                            <Icon
                              fontSize='1.25rem'
                              icon={values.showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button type='submit' variant='contained'>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
          <Snackbar
            open={open}
            onClose={handleClose}
            autoHideDuration={3000}
            TransitionProps={{ onExited: handleExited }}
            key={messageInfo ? messageInfo.key : undefined}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            message={messageInfo ? messageInfo.message : undefined}
          >
            <Alert
              elevation={3}
              variant='filled'
              onClose={handleClose}
              sx={{ width: '100%' }}
              severity={messageInfo?.key === 'success' ? 'success' : 'error'}
            >
              {messageInfo?.message}
            </Alert>
          </Snackbar>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Recent devices' />

          <Divider sx={{ m: '0 !important' }} />

          <TableContainer>
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Browser</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Recent Activity</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((item: DataType, index: number) => (
                  <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 2, fontSize: '1.125rem', color: item.color }
                        }}
                      >
                        <Icon icon={item.icon} />
                        <Typography noWrap sx={{ color: 'text.secondary' }}>
                          {item.browser}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: 'text.secondary' }}>
                        {item.device}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: 'text.secondary' }}>
                        {item.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: 'text.secondary' }}>
                        {item.recentActivity}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewSecurity
