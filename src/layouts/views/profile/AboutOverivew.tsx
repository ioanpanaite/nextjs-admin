// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { ProfileTabCommonType, ProfileTeamsType } from 'src/types/apps/profileTypes'

import { UserDataType } from 'src/context/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserSuspendDialog from '../user/view/UserSubscriptionDialog'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateUser } from 'src/store/apps/user'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Props {
  data: UserDataType
}

interface ColorsType {
  [key: string]: ThemeColor
}

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const defaultValues = {
  email: '',
  fullName: '',
  username: ''
}

interface FormData {
  email: string
  fullName: string
  username: string
}

interface ProfileData {
  email: string
  fullName: string
  username: string
  status: string
  role: string
}

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


const AboutOverivew = (props: Props) => {
  const { data } = props
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [profile, setProfile] = useState<ProfileData>(data)

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

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
    const getUserProfile = async () => {
      const { data: profileData } = await axios.get(`/api/profile/${data.id}`)
      if (profileData.ok) {
        if (profileData.result.username !== data.username) {
          setProfile(profileData.result)
          reset({ ...data, fullName: profileData.result.fullName, username: profileData.result.username, email: profileData.result.email })
        } else {
          setProfile(data)
          reset(data)
        }
      }
    }

    getUserProfile()
  }, [reset])

  const onSubmit = async (profileData: FormData) => {
    try {
      await dispatch(updateUser({ ...profileData })).unwrap()

      toast.success('Updated profile info successfully')
      setProfile({ ...data, username: profileData.username, email: profileData.email, fullName: profileData.fullName })
    } catch (error: any) {
      toast.error(error?.message)
    }

    handleEditClose()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  About
                </Typography>
                <Icon icon={'tabler:edit'} fontSize='1.625rem' onClick={handleEditClickOpen} />
              </Box>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Username:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>@{profile.username}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{profile.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={profile.status}
                    color={statusColors[profile.status]}
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Role:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{profile.role}</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>

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
                  Updating profile details will receive a privacy audit.
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
                  <Grid item xs={12} sm={12}>
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
        </Card>
      </Grid>
    </Grid>
  )
}

AboutOverivew.acl = {
  action: 'manage',
  subject: 'aboutoverivew'
}

export default AboutOverivew
