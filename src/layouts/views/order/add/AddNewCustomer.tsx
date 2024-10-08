// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { OrderClientType } from 'src/types/apps/orderTypes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { addUser } from 'src/store/apps/user'
import { Plan, Role, Status } from 'src/context/types'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useState, ChangeEvent, ElementType } from 'react'
import { ButtonProps } from '@mui/material'

interface Props {
  open: boolean
  toggle: () => void
  clients: OrderClientType[] | undefined
  setClients: (val: OrderClientType[]) => void
  setSelectedClient: (val: OrderClientType) => void
}

interface FormData {
  siteName: string
  accountId: string
  deliveryAddress: string
  phone: string
  email: string
  name: string
  avatarImage: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  company: yup.string().required(),
  contact: yup.string().min(10).max(10).required(),
  address: yup.string().max(120).required()
})

const AddNewCustomer = ({ open, toggle, setSelectedClient, clients, setClients }: Props) => {

  const dispatch = useDispatch<AppDispatch>()
  const { data: session } = useSession()

  const [imgSrc, setImgSrc] = useState<string>('')
  const [fileData, setFileData] = useState<File>()
  const [inputValue, setInputValue] = useState<string>('')

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customerId: '', siteName: '', accountId: '', deliveryAddress: '', phone: '', email: '', name: '', avatarImage: '' }
  })

  const onSubmit = async (data: FormData) => {
    const { siteName,
      accountId,
      deliveryAddress,
      phone,
      email,
      name,
      avatarImage } = data
    const finalData = {
      customerId: '',
      siteName,
      accountId,
      deliveryAddress,
      phone,
      email,
      name,
      avatarImage
    }

    const result = await axios.post('/api/customers/create-customer', { data: { ...data, supplierEmail: session?.user.email } })
    if(result.status == 200) {
      if (fileData) {
        const id = result.data.info.id as string
        const fileType = fileData?.type as string
        const result2 = await axios.post('/api/customers/file/upload', { data: { imageType: 'avatar', fileKey: id, fileType: fileType } })
        const preSignedUrl = result2.data.url

        if (clients !== undefined) {
          setClients([...clients, {...finalData, avatarImage: preSignedUrl, customerId: id}])
        }
    
        setSelectedClient({...finalData, avatarImage: preSignedUrl})
    
        const response = await axios.put(preSignedUrl, fileData, {
          headers: {
            "Content-type": fileType,
            "Access-Control-Allow-Origin": "*",
          },
        })
      }
      toggle()
      reset({ customerId: '', siteName: '', accountId: '', deliveryAddress: '', phone: '', email: '', name: '' })
    }
  }

  const handleDrawerClose = () => {
    toggle()
    reset({ customerId: '', siteName: '', accountId: '', deliveryAddress: '', phone: '', email: '', name: '' })
    handleRefreshImage()
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
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
    >
      <Header>
        <Typography variant='h6'>Add New Customer</Typography>
        <IconButton
          size='small'
          onClick={toggle}
          sx={{
            p: '0.375rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        {imgSrc ?
          <>
            <Box
              sx={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImgStyled src={imgSrc} alt='Product Image' />
              <Box sx={{
                position: 'absolute',
                top: 10,
                right: 10,
              }}>
                <IconButton onClick={handleRefreshImage} sx={{ bgcolor: 'pink' }}>
                  <Icon icon='tabler:refresh' fontSize='1.75rem' color='black' />
                </IconButton>
              </Box>

            </Box>
          </> :
          <Box
            sx={{
              mb: 8.75,
              mx: 0,
              px: 2,
              width: '100%',
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              
              // backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
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
      </Box>
      <Box component='form' sx={{ p: theme => theme.spacing(0, 6, 6) }} onSubmit={handleSubmit(onSubmit)}>

        <Controller
          name='siteName'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              label='siteName'
              value={value}
              sx={{ mb: 5 }}
              variant='outlined'
              onChange={onChange}
              error={Boolean(errors.siteName)}
              {...(errors.siteName && { helperText: errors.siteName.message })}
            />
          )}
        />
        <Controller
          name='accountId'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              value={value}
              sx={{ mb: 5 }}
              label='accountId'
              variant='outlined'
              onChange={onChange}
              error={Boolean(errors.accountId)}
              {...(errors.accountId && { helperText: errors.accountId.message })}
            />
          )}
        />
        <Controller
          name='deliveryAddress'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              type='deliveryAddress'
              label='deliveryAddress'
              value={value}
              sx={{ mb: 5 }}
              variant='outlined'
              onChange={onChange}
              error={Boolean(errors.deliveryAddress)}
              {...(errors.deliveryAddress && { helperText: errors.deliveryAddress.message })}
            />
          )}
        />
        <Controller
          name='email'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              rows={6}
              type='email'
              value={value}
              sx={{ mb: 5 }}
              label='email'
              variant='outlined'
              onChange={onChange}
              error={Boolean(errors.email)}
              placeholder='1037 Lady Bug  Drive New York'
              {...(errors.email && { helperText: errors.email.message })}
            />
          )}
        />
        <Controller
          name='name'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              rows={6}
              type='email'
              value={value}
              sx={{ mb: 5 }}
              label='name'
              variant='outlined'
              onChange={onChange}
              error={Boolean(errors.name)}
              placeholder='1037 Lady Bug  Drive New York'
              {...(errors.name && { helperText: errors.name.message })}
            />
          )}
        />
        <Controller
          name='phone'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              type='number'
              sx={{ mb: 6 }}
              value={value}
              variant='outlined'
              onChange={onChange}
              label='phone Number'
              placeholder='763-242-9206'
              error={Boolean(errors.phone)}
              {...(errors.phone && { helperText: errors.phone.message })}
            />
          )}
        />
        <div>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Add
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleDrawerClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Drawer>
  )
}

export default AddNewCustomer
