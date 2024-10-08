import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Box, BoxProps, Button, Drawer, Grid, IconButton, Typography, styled } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { CustomerType, ProductDataType, updateProduct } from 'src/store/apps/product'
import { useSession } from 'next-auth/react'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

interface SidebarAddProductType {
  customerData: CustomerType | null
  open: boolean
  toggle: () => void
}

const defaultProductValues = {
  code: '',
  name: '',
  unit: '',
  quantity: '',
  price: '',
}

const productSchema = yup.object().shape({
  name: yup.string().required(),
  unit: yup.string().required(),
  quantity: yup.string().required(),
  price: yup.string().required(),
})

const AddProductDrawer = (props: SidebarAddProductType) => {
  // ** Props
  const { customerData, open, toggle } = props

  const dispatch = useDispatch<AppDispatch>()
  const { data: session } = useSession()

  const {
    reset,
    control: productControl,
    handleSubmit: handleProductSubmit,
    formState: { errors: productErrors }
  } = useForm({
    defaultValues: defaultProductValues,
    resolver: yupResolver(productSchema)
  })

  const onSubmit = (data: ProductDataType) => {
    try {
      dispatch(updateProduct({ supplierEmail: session?.user.email || '', customerData: customerData, productData: data }))
    } catch (error) {
    }
    handleClose()
  }

  const handleClose = () => {
    toggle()
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
        <Typography variant='h5'>Add new product</Typography>
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
        <form key={1} onSubmit={handleProductSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='code'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Code'
                    onChange={onChange}
                    placeholder='e.g 122312'
                    aria-describedby='stepper-linear-product-code'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='unit'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Unit'
                    onChange={onChange}
                    error={Boolean(productErrors.unit)}
                    placeholder='e.g kg'
                    aria-describedby='stepper-linear-product-unit'
                    {...(productErrors.unit && { helperText: productErrors.unit.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='name'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Name'
                    onChange={onChange}
                    placeholder='e.g Banana'
                    error={Boolean(productErrors.name)}
                    aria-describedby='stepper-linear-product-name'
                    {...(productErrors.name && { helperText: productErrors.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='quantity'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    type='number'
                    fullWidth
                    value={value}
                    label='Quantity'
                    onChange={onChange}
                    error={Boolean(productErrors.quantity)}
                    aria-describedby='stepper-linear-product-price'
                    {...(productErrors.quantity && { helperText: productErrors.quantity.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='price'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    type='number'
                    fullWidth
                    value={value}
                    label='Price'
                    onChange={onChange}
                    error={Boolean(productErrors.price)}
                    aria-describedby='stepper-linear-product-price'
                    {...(productErrors.price && { helperText: productErrors.price.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type='submit' variant='contained'>
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddProductDrawer
