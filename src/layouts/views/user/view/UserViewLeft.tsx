// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import UserSuspendDialog from './UserSubscriptionDialog'
import UserSubscriptionDialog from './UserSubscriptionDialog'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateUser } from 'src/store/apps/user'
import * as yup from 'yup'
import { Role, Status } from 'src/context/types'
import GoodsServices from '../../profile/GoodsServices'

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: 0,
  left: -10,
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
  alignSelf: 'flex-end',
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize
}))

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  fullName: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  email: '',
  fullName: '',
  username: ''
}

interface UserData {
  email: string
  fullName: string
  username: string
  password?: string
  updatedAt?: string
}

const UserViewLeft = () => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [role, setRole] = useState<string>('buyer')
  const [status, setStatus] = useState<string>('active')
  const [data, setData] = useState<UsersType>()
  const router = useRouter()
  console.log(data, '===data')

  const dispatch = useDispatch<AppDispatch>()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const storedUser: string = window.localStorage.getItem('selected_user') as string || ''
    if (!!storedUser) {
      const user = JSON.parse(storedUser)
      setData(user)
      reset(user)
    } else {
      router.push('/user/list')
    }
  }, [openEdit, router, reset])

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)

  const onSubmit = (userData: UserData) => {
    delete userData?.password
    delete userData?.updatedAt
    dispatch(updateUser({ ...userData, role, status, }))

    window.localStorage.setItem('selected_user', JSON.stringify(userData))
    reset()
    handleEditClose()
  }

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  alt={data.fullName}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor as ThemeColor}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data.fullName)}
                </CustomAvatar>
              )}
              <Typography variant='h4' sx={{ mb: 3 }}>
                {data.fullName}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={data.role}
                color={roleColors[data.role]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                    <Icon fontSize='1.75rem' icon='tabler:checkbox' />
                  </CustomAvatar>
                  <div>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>1.23k</Typography>
                    <Typography variant='body2'>Task Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                    <Icon fontSize='1.75rem' icon='tabler:briefcase' />
                  </CustomAvatar>
                  <div>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>568</Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />

            <CardContent sx={{ pb: 4 }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Details
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Username:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>@{data.username}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={data.status}
                    color={statusColors[data.status]}
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Role:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{data.role}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
              <Button color='error' variant='tonal' onClick={() => setSuspendDialogOpen(true)}>
                Suspend
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
                  textAlign: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                Edit User Information
              </DialogTitle>

              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                  }}
                >
                  <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                    Updating user details will receive a privacy audit.
                  </DialogContentText>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='fullName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            onChange={onChange}
                            label='Full Name'
                            error={Boolean(errors.fullName)}
                            {...(errors.fullName && { helperText: errors.fullName.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='username'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            onChange={onChange}
                            label='Username'
                            error={Boolean(errors.username)}
                            {...(errors.username && { helperText: errors.username.message })}
                            InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='email'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label='Email'
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.email)}
                            {...(errors.email && { helperText: errors.email.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        select
                        fullWidth
                        sx={{ mb: 4 }}
                        label='Select Role'
                        onChange={e => setRole(e.target.value)}
                        SelectProps={{ value: role, onChange: e => setRole(e.target.value as string) }}
                      >
                        {
                          Object.keys(Role).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
                        }
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        select
                        fullWidth
                        sx={{ mb: 4 }}
                        label='Select User Status'
                        onChange={e => setStatus(e.target.value)}
                        SelectProps={{ value: status, onChange: e => setStatus(e.target.value as string) }}
                      >
                        {
                          Object.keys(Status).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
                        }
                      </CustomTextField>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                    Submit
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                    Cancel
                  </Button>
                </DialogActions>
              </form>
            </Dialog>

            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <GoodsServices supplierEmail={data.email} />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pb: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <CustomChip rounded skin='light' size='small' color='primary' label='Popular' />
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Sup>$</Sup>
                <Typography
                  variant='h4'
                  sx={{ mt: -1, mb: -1.2, color: 'primary.main', fontSize: '2.375rem !important' }}
                >
                  99
                </Typography>
                <Sub>/ month</Sub>
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ mt: 2.5, mb: 4 }}>
                <Box sx={{ display: 'flex', mb: 2, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='tabler:point' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>10 Users</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='tabler:point' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>Up to 10GB storage</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <Icon icon='tabler:point' fontSize='1.125rem' />
                  <Typography sx={{ color: 'text.secondary' }}>Basic Support</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 500 }}>Days</Typography>
                <Typography sx={{ fontWeight: 500 }}>75% Completed</Typography>
              </Box>
              <LinearProgress value={75} variant='determinate' sx={{ height: 10 }} />
              <Typography sx={{ mt: 1.5, mb: 6, color: 'text.secondary' }}>4 days remaining</Typography>
              <Button fullWidth variant='contained' onClick={handlePlansClickOpen}>
                Upgrade Plan
              </Button>
            </CardContent>

            <Dialog
              open={openPlans}
              onClose={handlePlansClose}
              aria-labelledby='user-view-plans'
              aria-describedby='user-view-plans-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
              <DialogTitle
                id='user-view-plans'
                sx={{
                  textAlign: 'center',
                  fontSize: '1.625rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                Upgrade Plan
              </DialogTitle>

              <DialogContent
                sx={{ px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`] }}
              >
                <DialogContentText sx={{ textAlign: 'center' }} id='user-view-plans-description'>
                  Choose the best plan for the user.
                </DialogContentText>
              </DialogContent>

              <DialogContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: ['wrap', 'nowrap'],
                  pt: theme => `${theme.spacing(2)} !important`,
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <CustomTextField
                  select
                  fullWidth
                  label='Choose Plan'
                  defaultValue='Standard'
                  sx={{ mr: [0, 3], mb: [3, 0] }}
                >
                  <MenuItem value='Basic'>Basic - $0/month</MenuItem>
                  <MenuItem value='Standard'>Standard - $99/month</MenuItem>
                  <MenuItem value='Enterprise'>Enterprise - $499/month</MenuItem>
                  <MenuItem value='Company'>Company - $999/month</MenuItem>
                </CustomTextField>
                <Button variant='contained' sx={{ minWidth: ['100%', 0], mt: 4 }}>
                  Upgrade
                </Button>
              </DialogContent>

              <Divider sx={{ m: '0 !important' }} />

              <DialogContent
                sx={{
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <Typography variant='h6' sx={{ mb: 2, color: theme => theme.palette.text.secondary }}>
                  User current plan is standard plan
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: ['wrap', 'nowrap'],
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
                    <Sup>$</Sup>
                    <Typography variant='h1' sx={{ mb: -1.2, color: 'primary.main', fontSize: '3rem !important' }}>
                      99
                    </Typography>
                    <Sub>/ month</Sub>
                  </Box>
                  <Button color='error' variant='tonal' sx={{ mt: 2 }} onClick={() => setSubscriptionDialogOpen(true)}>
                    Cancel Subscription
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

UserViewLeft.acl = {
  action: 'read',
  subject: 'userviewleft'
}

export default UserViewLeft
