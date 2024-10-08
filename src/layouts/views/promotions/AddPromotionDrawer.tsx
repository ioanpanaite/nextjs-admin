// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { Status } from 'src/context/types'
import { addPromotion } from 'src/store/apps/promotion'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface FormData {
  title: string
  description: string
  ruleValidDate: string
  percentAmount: string
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

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  title: yup
    .string()
    .min(3, obj => showErrors('Title', obj.value.length, obj.min))
    .required(),
})

const defaultValues = {
  title: '',
  description: '',
  ruleValidDate: '',
  percentAmount: ''
}

const SidebarAddPromotion = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [status, setStatus] = useState<string>('active')

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const promoData = { ...data, status }
    console.log(promoData, '===promoData')
    try {
      const result = await dispatch(addPromotion(promoData)).unwrap()
      console.log(result, '===result')
      toggle()
      reset()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Add Price & Promotion</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Title'
                onChange={onChange}
                placeholder='Early Pricing Inventry'
                error={Boolean(errors.title)}
                {...(errors.title && { helperText: errors.title.message })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Description'
                onChange={onChange}
                placeholder='Act now exclusive savings'
                error={Boolean(errors.description)}
                {...(errors.description && { helperText: errors.description.message })}
              />
            )}
          />
          <Controller
            name='ruleValidDate'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='date'
                label='Rule valid date'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.ruleValidDate)}
                {...(errors.ruleValidDate && { helperText: errors.ruleValidDate.message })}
              />
            )}
          />
          <Controller
            name='percentAmount'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Percent or Amount'
                onChange={onChange}
                placeholder='20%'
                error={Boolean(errors.percentAmount)}
                {...(errors.percentAmount && { helperText: errors.percentAmount.message })}
              />
            )}
          />
          <CustomTextField
            select
            fullWidth
            value={status}
            sx={{ mb: 4 }}
            label='Select Promotion Status'
            onChange={e => setStatus(e.target.value)}
            SelectProps={{ value: status, onChange: e => setStatus(e.target.value as string) }}
          >
            {
              Object.keys(Status).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
            }
          </CustomTextField>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddPromotion
