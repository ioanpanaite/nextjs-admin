// ** React Imports
import { Ref, Dispatch, forwardRef, ReactElement, SetStateAction, useEffect, useState, ElementType, ChangeEvent } from 'react'

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
import { ButtonProps } from '@mui/material'

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
import axios from 'axios'
import { CustomerModelType, setUpdateResult } from 'src/store/apps/customer'
import { useSession } from 'next-auth/react'

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

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

type Props = {
  show: boolean;
  user?: CustomerModelType;
  setShow: Dispatch<SetStateAction<boolean>>;
}

interface CustomerData {
  id: string
  siteName: string
  accountId: string
  deliveryAddress: string
  phone: string
  email: string
  name: string
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
  name: yup
    .string()
    .min(3, obj => showErrors('User Name', obj.value.length, obj.min))
    .required(),
  siteName: yup
    .string()
    .min(3, obj => showErrors('Site Name', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  id: '',
  siteName: '',
  accountId: '',
  deliveryAddress: '',
  phone: '',
  email: '',
  name: '',
}

const DialogCreateCustomer = (props: Props) => {
  // hook
  const dispatch = useDispatch<AppDispatch>()
  const { data: session } = useSession()
  const [imgSrc, setImgSrc] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [fileData, setFileData] = useState<File>()

  const { show, setShow } = props

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

  const onSubmit = async (data: CustomerData) => {
    const result = await axios.post('/api/customers/create-customer', { data: { ...data, supplierEmail: session?.user.email } })
    if (result.status == 200) {
      reset()
      if (fileData) {
        const id = result.data.info.id as string
        const fileType = fileData?.type as string
        const result2 = await axios.post('/api/customers/file/upload', { data: { imageType: 'avatar', fileKey: id, fileType: fileType } })
        const preSignedUrl = result2.data.url

        const response = await axios.put(preSignedUrl, fileData, {
          headers: {
            "Content-type": fileType,
            "Access-Control-Allow-Origin": "*",
          },
        })
      }
      setShow(false)
      dispatch(setUpdateResult({
        status: 'success',
        message: 'Created Customer Successfully'
      }));
    } else {
      dispatch(setUpdateResult({
        status: 'error',
        message: 'Something wrong'
      }));
    }
  }

  const handleClose = () => {
    reset()
    setShow(false)
  }

  const handleRefreshImage = () => {
    setImgSrc('')
  }

  const handleInputImageChange = async (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = async () => {
        setImgSrc(reader.result as string)
      }
      reader.readAsDataURL(files[0])
      setFileData(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
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
                Add New Customer Information
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Creating customer details will receive a privacy audit.
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography sx={{ mb: 4, }}></Typography>
                {imgSrc ?
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImgStyled src={imgSrc} alt='Product Image' />
                      <Icon onClick={handleRefreshImage} icon='tabler:refresh' fontSize='1.75rem' />
                    </Box>
                  </> :
                  <Box
                    sx={{
                      mb: 8.75,
                      mx: 10,
                      px: 2,
                      width: 48,
                      height: 48,
                      display: 'flex',
                      borderRadius: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                    }}
                  >
                    <ButtonStyled sx={{ px: 0 }} component='label' variant='contained' htmlFor='product-upload-image'>
                      <Icon icon='tabler:upload' fontSize='1.75rem' />
                      <input
                        hidden
                        type='file'
                        value={inputValue}
                        accept='image/png, image/jpeg'
                        onChange={(e) => handleInputImageChange(e)}
                        id='product-upload-image'
                      />
                    </ButtonStyled>
                  </Box>
                }
                <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={9}>
                <Grid container spacing={6} sx={{ mb: 5 }}>
                  <Grid item sm={6} xs={12} md={6}>
                    <Controller
                      name='name'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Name'
                          error={Boolean(errors.name)}
                          {...(errors.name && { helperText: errors.name.message })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Controller
                      name='accountId'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Account ID'
                          value={value}
                          onChange={onChange}
                          error={Boolean(errors.accountId)}
                          {...(errors.accountId && { helperText: errors.accountId.message })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={6} sx={{ mb: 5 }}>

                  <Grid item sm={6} xs={12}>
                    <Controller
                      name='siteName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Site Name'
                          value={value}
                          onChange={onChange}
                          error={Boolean(errors.siteName)}
                          {...(errors.siteName && { helperText: errors.siteName.message })}
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
                </Grid>
                <Grid container spacing={6} sx={{ mb: 5 }}>
                  <Grid item sm={6} xs={12}>
                    <Controller
                      name='deliveryAddress'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Address'
                          value={value}
                          onChange={onChange}
                          error={Boolean(errors.deliveryAddress)}
                          {...(errors.deliveryAddress && { helperText: errors.deliveryAddress.message })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <Controller
                      name='phone'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Phone'
                          error={Boolean(errors.phone)}
                          {...(errors.phone && { helperText: errors.phone.message })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
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

export default DialogCreateCustomer
