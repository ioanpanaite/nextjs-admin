// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import ProductList from './ProductList'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { ProductModelType, updateContactDetails, updateProduct } from 'src/store/apps/product'
import { useSession } from 'next-auth/react'
import { setUpdateResult } from 'src/store/apps/customer'

interface CustomerType {
  siteName: string
  address: string
  accountId: string
}

const steps = [
  {
    title: 'Customer Details',
    subtitle: 'Enter your Customer Details'
  },
  {
    title: 'Contact Details',
    subtitle: 'Enter your Contact Details'
  },
  {
    title: 'Product list',
    subtitle: 'Setup product'
  },]

const defaultAccountValues = {
  siteName: '',
  address: '',
  accountId: '',
}

const defaultContactValues = {
  name: '',
  phone: '',
  email: ''
}

const accountSchema = yup.object().shape({
  siteName: yup.string().required(),
  address: yup.string().required(),
})
const contactSchema = yup.object().shape({
  name: yup.string().required(),
  phone: yup.string().required(),
  email: yup.string().email().required(),
})

const StepperLinearWithValidation = ({ handleClose }: { handleClose: () => void }) => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [customerData, setCustomer] = useState<CustomerType>(defaultAccountValues)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.product)
  const { data: session } = useSession()

  // ** Hooks
  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })
  
  const {
    reset: contactReset,
    control: contactControl,
    handleSubmit: handleContactSubmit,
    formState: { errors: contactErrors }
  } = useForm({
    defaultValues: defaultContactValues,
    resolver: yupResolver(contactSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    contactReset({ name: '', phone: '', email: '' })
    accountReset({ siteName: '', address: '', accountId: '' })
  }

  const onSubmit = (data: any) => {
    if (activeStep === steps.length - 1) {
      const productData = store.data.length > 0 && store.data[0] as ProductModelType
      if (productData) {
        const customerId = productData?.customerId as string || ''
        dispatch(updateContactDetails({
          supplierEmail: session?.user.email,
          customerId: customerId,
          contactData: data
        }))

        // notify created new customer
        dispatch(setUpdateResult({
          status: 'success',
          message: 'Created Customer Successfully'
        }));
        
        // close modal 
        handleClose()
        handleReset()
      }
    }
  }

  const submitContact = (data: CustomerType) => {
    setCustomer(data)
    setActiveStep(activeStep + 1)
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleAccountSubmit(submitContact)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='siteName'
                  control={accountControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Site name'
                      placeholder='e.g the Cafe'
                      onChange={onChange}
                      error={Boolean(accountErrors.siteName)}
                      aria-describedby='stepper-linear-account-siteName'
                      {...(accountErrors.siteName && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='address'
                  control={accountControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Delivery address'
                      placeholder='e.g NE3 FOD'
                      onChange={onChange}
                      error={Boolean(accountErrors.address)}
                      aria-describedby='stepper-linear-account-address'
                      {...(accountErrors.address && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='accountId'
                  control={accountControl}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Account Id'
                      placeholder='e.g 122321 Optional'
                      onChange={onChange}
                      error={Boolean(accountErrors.accountId)}
                      aria-describedby='stepper-linear-account-accountId'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' disabled>
                  Back
                </Button>
                <Button type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={2} onSubmit={handleContactSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[2].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[2].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='name'
                  control={contactControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Name'
                      onChange={onChange}
                      error={Boolean(contactErrors.name)}
                      aria-describedby='stepper-linear-contact-name'
                      {...(contactErrors.name && { helperText: contactErrors.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='phone'
                  control={contactControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Phone'
                      onChange={onChange}
                      error={Boolean(contactErrors.phone)}
                      aria-describedby='stepper-linear-contact-phone'
                      {...(contactErrors.phone && { helperText: contactErrors.phone.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='email'
                  control={contactControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Email'
                      onChange={onChange}
                      error={Boolean(contactErrors.email)}
                      aria-describedby='stepper-linear-product-email'
                      {...(contactErrors.email && { helperText: contactErrors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 2:
        return (
          <Grid item xs={12}>
            <ProductList data={customerData} handleBack={handleBack} handleNext={handleNext} />
          </Grid>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={handleReset}>
              Close
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps: {
                error?: boolean
              } = {}
              if (index === activeStep) {
                labelProps.error = false
                if ((accountErrors.siteName || accountErrors.address) && activeStep === 0) {
                  labelProps.error = true
                } else if (
                  (contactErrors.name || contactErrors.phone || contactErrors.email) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default StepperLinearWithValidation
