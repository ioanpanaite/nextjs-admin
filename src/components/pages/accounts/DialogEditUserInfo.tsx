// ** React Imports
import { Ref, Dispatch, forwardRef, ReactElement, SetStateAction, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Plan, Role, Status, UserDataType } from 'src/context/types'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { updateUser } from 'src/store/apps/user'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

type Props = {
  show: boolean;
  user?: UserDataType;
  setShow: Dispatch<SetStateAction<boolean>>;
}

interface UserData {
  email: string
  fullName: string
  username: string
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

const defaultValues = {
  email: '',
  fullName: '',
  username: ''
}

const DialogEditUserInfo = (props: Props) => {
  const { show, setShow, user } = props
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('buyer')
  const [status, setStatus] = useState<string>('active')

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
    const setValues = {
      email: user?.email as string || '',
      fullName: user?.fullName as string || '',
      username: user?.username as string || ''
    }
    reset(setValues)
    setPlan(user?.currentPlan as string || '')
    setRole(user?.role as string || '')
    setStatus(user?.status as string || '')
  }, [user, reset])

  const onSubmit = (data: UserData) => {
    dispatch(updateUser({ ...data, id: user?.id || '', role, status, currentPlan: plan }))
    reset()
    setShow(false)
  }

  const handleClose = () => {
    reset()
    setShow(false)
  }

  return (
    <>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        onBackdropClick={() => handleClose()}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={() => setShow(false)}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Edit User Information
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Updating user details will receive a privacy audit.
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
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
              <Grid item sm={6} xs={12}>
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
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
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
              <Grid item sm={6} xs={12}>
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
              <Grid item sm={6} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  sx={{ mb: 6 }}
                  label='Select Plan'
                  SelectProps={{ value: plan, onChange: e => setPlan(e.target.value as string) }}
                >
                  {
                    Object.keys(Plan).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
                  }
                </CustomTextField>
              </Grid>
              <Grid item xs={12}>
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
            <Button variant='contained' sx={{ mr: 1 }} type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => handleClose()}>
              Discard
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default DialogEditUserInfo
