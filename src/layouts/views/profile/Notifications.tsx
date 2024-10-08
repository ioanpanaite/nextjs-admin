// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import axios from 'axios'
import toast from 'react-hot-toast'

interface FormData {
  email: string
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
})

const Notifications = () => {
  const { user } = useAuth()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const getNotification = async () => {
      try {
        const { data } = await axios.get(`/api/profile/notification/${user?.id}`)
        if (data.ok) {
          if (data.result.notifyEmail) {
            reset({ email: data.result.notifyEmail })
          } else {
            reset({ email: user?.email })
          }
        } else {
          toast.error('Server is not responed.')
        }
      } catch (error) {
        toast.error('Something went wrong.')
      }
    }
    getNotification()
  }, [])

  const onSubmit = async (data: FormData) => {
    const notification = { ...data, id: user?.id }
    const { data: result } = await axios.post('/api/profile/notification/update', { data: notification })
    if (result.ok) {
      toast.success(result.message)
      reset(data)
    } else {
      toast.success('Something went wrong.')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Typography variant='body2' sx={{ mt: 4, color: 'text.disabled', textTransform: 'uppercase', textAlign: 'center' }}>
            you will receive new customer requests at this email address
          </Typography>

          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Box
                  component='form'
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{
                    mx: 'auto',
                    width: '100%',
                    maxWidth: 360,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='email'
                        label='Email'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={onChange}
                        error={Boolean(errors.email)}
                        placeholder='e.g. johndoe@email.com'
                        {...(errors.email && { helperText: errors.email.message })}
                      />
                    )}
                  />
                  <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
                    <Button type='submit' variant='contained'>
                      Save
                    </Button>
                    <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Notifications
