// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, InputAdornment, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchSocial, updateSocial } from 'src/store/apps/social'

interface SocialMedia {
  instagram: string
  linkedin: string
  twitter: string
}

const defaultValues = {
  instagram: '',
  linkedin: '',
  twitter: '',
}

const SupplierSocial = () => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [social, setSocial] = useState<SocialMedia>()
  const [status, setStatus] = useState<boolean>(false)

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Hook
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.social)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    const getUserProfile = async () => {
      await dispatch(fetchSocial()).unwrap()
      setSocial(store.data)
      reset(store.data)
      setStatus(true)
    }

    if (!status) getUserProfile()
    else {
      setSocial(store.data)
      reset(store.data)
    }

  }, [reset, store])

  const onSubmit = async (data: SocialMedia) => {
    try {
      await dispatch(updateSocial(data)).unwrap()
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
                  Social media
                </Typography>
                <Icon icon={'tabler:edit'} fontSize='1.625rem' onClick={handleEditClickOpen} />
              </Box>
              <Box sx={{ pt: 4 }}>
                {social?.instagram && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Instagram</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    @{social?.instagram}
                  </Typography>
                </Box>}
                {social?.linkedin && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Linkedin</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>https://www.linkedin.com/{social?.linkedin}</Typography>
                </Box>}
                {social?.twitter && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Twitter</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>https://www.twitter.com/{social?.twitter}</Typography>
                </Box>}
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
              Edit Social Media
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  make your social media visible to potential customers on your NOM supplier profile
                </DialogContentText>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='instagram'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Instagram'
                          error={Boolean(errors.instagram)}
                          {...(errors.instagram && { helperText: errors.instagram.message })}
                          InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='linkedin'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Linkedin'
                          error={Boolean(errors.linkedin)}
                          {...(errors.linkedin && { helperText: errors.linkedin.message })}
                          InputProps={{ startAdornment: <InputAdornment position='start'>https://www.linkedin.com/</InputAdornment> }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='twitter'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Twitter'
                          error={Boolean(errors.twitter)}
                          {...(errors.twitter && { helperText: errors.twitter.message })}
                          InputProps={{ startAdornment: <InputAdornment position='start'>https://www.twitter.com/</InputAdornment> }}
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

SupplierSocial.acl = {
  action: 'manage',
  subject: 'SupplierSocial'
}

export default SupplierSocial
