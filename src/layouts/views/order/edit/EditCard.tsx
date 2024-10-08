// ** React Imports
import { useEffect, useState, forwardRef, SyntheticEvent, ForwardedRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import { SelectChangeEvent } from '@mui/material/Select'
import InputAdornment from '@mui/material/InputAdornment'
import CardContent, { CardContentProps } from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import axios from 'axios'
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { SingleOrderType, OrderClientType, OrderType, OrderStatus } from 'src/types/apps/orderTypes'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import EditActions from './EditActions'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { TotalAmount, getSubTotal, getTotal } from '../add/AddCard'
import { Alert, Snackbar } from '@mui/material'
import { SnackbarMessage } from 'src/types/apps/userTypes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateOrder } from 'src/store/apps/order'

interface Props {
  data: SingleOrderType,
  toggleSendOrderDrawer: () => void,
  toggleAddPaymentDrawer: () => void
}

interface PickerProps {
  label?: string
}

interface FormValues {
  product: {
    code: string,
    title: string,
    unit: string,
    image?: string,
    quantity: number,
    price: number
  }[],
  orderNote: string
}

const CustomInput = forwardRef(({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: { sm: '250px', xs: '170px' } }} />
})

const RepeatingContent = styled(Grid)<GridProps>(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-2.375rem',
    position: 'absolute'
  },
  [theme.breakpoints.down('md')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)<CardContentProps>(({ theme }) => ({
  padding: theme.spacing(16, 10, 10),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(16)
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6)
  }
}))

const OrderAction = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const EditCard = ({ data, toggleSendOrderDrawer, toggleAddPaymentDrawer }: Props) => {
  // ** States
  const [selected, setSelected] = useState<string>('')
  const [clients, setClients] = useState<OrderClientType[] | undefined>(undefined)
  const [selectedClient, setSelectedClient] = useState<OrderClientType | null>(null)
  const [dueDate, setDueDate] = useState<DateType>(data ? new Date(data.order.dueDate) : new Date())
  const [issueDate, setIssueDate] = useState<DateType>(data ? new Date(data.order.issuedDate) : new Date())
  const [status, setStatus] = useState<string>(data.order.orderStatus)

  const [discount, setDiscount] = useState<number>(10)
  const [tax, setTax] = useState<number>(20)

  // ** Hook
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()

  // Notification
  const [open, setOpen] = useState<boolean>(false)
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined)
  const handleClose = (event: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }
  const handleExited = () => {
    setMessageInfo(undefined)
  }

  useEffect(() => {
    axios.get('/api/admin/order/clients').then(response => {
      const orderData = data.order
      if (response.data && clients === undefined) {
        const { data } = response.data
        setClients(data)

        for (const order of data) {
          if (order.name === orderData.name) {
            setSelected(order.name)
            setSelectedClient(order)
          }
        }
      }
    })

  }, [clients, data])

  // ** Handle Order To Change
  const handleOrderChange = (e: SelectChangeEvent<unknown>) => {
    setSelected(e.target.value as string)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.name === e.target.value)[0])
    }
  }

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      product: data.order.product,
      orderNote: data.order.orderNote
    },
    mode: 'onChange',
  })

  const productValues = useWatch({
    control,
    name: 'product'
  })

  const { fields, append, remove } = useFieldArray({
    name: 'product',
    control,
    rules: {
      required: "Please append at lest 1 item"
    }
  })


  const onSubmit = async (orderData: FormValues) => {
    const subTotal = getSubTotal(productValues)
    const total = getTotal(productValues, discount, tax)
    const numTotal = Number(total)

    if (selectedClient) {
      const order: OrderType = {
        id: data.order.id,
        supplierId: '',
        ...orderData,
        ...selectedClient,
        discount,
        tax,
        subTotal,
        total: numTotal,
        orderStatus: status,
        dueDate: dueDate?.toLocaleString() || '',
        issuedDate: issueDate?.toLocaleString() || ''
      }

      try {
        await dispatch(updateOrder(order)).unwrap()
        setMessageInfo({ key: 'success', message: "Updated order successfully." })
        setOpen(true)
      } catch (error: any) {
        setMessageInfo({ key: 'error', message: error?.message })
        setOpen(true)
        reset()
      }
    } else {
      setOpen(true)
      setMessageInfo({ key: 'error', message: 'Please select client to order.' })
      reset()
    }

  }

  if (data) {
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xl={9} md={8} xs={12}>
              <Card>
                <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
                  <Grid container>
                    <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                          <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              fill={theme.palette.primary.main}
                              d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                            />
                            <path
                              fill='#161616'
                              opacity={0.06}
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                            />
                            <path
                              fill='#161616'
                              opacity={0.06}
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              fill={theme.palette.primary.main}
                              d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                            />
                          </svg>
                          <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                            {themeConfig.templateName}
                          </Typography>
                        </Box>
                        <div>
                          <Typography sx={{ mb: 2, color: 'text.secondary' }}>Office 149, 450 South Brand Brooklyn</Typography>
                          <Typography sx={{ mb: 2, color: 'text.secondary' }}>San Diego County, CA 91905, USA</Typography>
                          <Typography sx={{ color: 'text.secondary' }}>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                        </div>
                      </Box>
                    </Grid>
                    <Grid item xl={6} xs={12}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                          <Typography variant='h4' sx={{ mr: 2, width: '105px' }}>
                            Order
                          </Typography>
                          <CustomTextField
                            fullWidth
                            value={data.order.id}
                            sx={{ width: { sm: '250px', xs: '170px' } }}
                            InputProps={{
                              disabled: true,
                              startAdornment: <InputAdornment position='start'>#</InputAdornment>
                            }}
                          />
                        </Box>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Issued:</Typography>
                          <DatePicker
                            id='issue-date'
                            selected={issueDate}
                            showDisabledMonthNavigation
                            customInput={<CustomInput />}
                            onChange={(date: Date) => setIssueDate(date)}
                          />
                        </Box>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Due:</Typography>
                          <DatePicker
                            selected={dueDate}
                            showDisabledMonthNavigation
                            customInput={<CustomInput />}
                            onChange={(date: Date) => setDueDate(date)}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Order Status:</Typography>

                          <CustomTextField
                            select
                            fullWidth
                            sx={{ width: { lg: '250px', xs: 'auto' }, color: 'text.secondary' }}
                            onChange={e => setStatus(e.target.value)}
                            SelectProps={{ value: status, onChange: e => setStatus(e.target.value as string) }}
                          >
                            {
                              Object.keys(OrderStatus).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
                            }
                          </CustomTextField>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                <Divider />

                <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
                  <Grid container>
                    <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
                      <Typography variant='h6' sx={{ mb: 6 }}>
                        Order To:
                      </Typography>
                      <CustomTextField
                        select
                        sx={{
                          mb: 4,
                          width: '200px',
                          '& .MuiFilledInput-input.MuiSelect-select': {
                            minWidth: '11rem !important'
                          }
                        }}
                        SelectProps={{ value: selected, onChange: e => handleOrderChange(e) }}
                      >
                        {clients !== undefined ? (
                          clients.map(client => (
                            <MenuItem key={client.name} value={client.name}>
                              {client.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value=''>No clients</MenuItem>
                        )}
                      </CustomTextField>
                      {selectedClient !== null ? (
                        <>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.siteName}</Typography>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.deliveryAddress}</Typography>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.phone}</Typography>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.email}</Typography>
                        </>
                      ) : null}
                    </Grid>
                  </Grid>
                </CardContent>

                <Divider />

                <RepeaterWrapper>
                  {fields.map((field, index) => {
                    return (
                      <Box key={field.id} className='repeater-wrapper' >
                        <Grid container >
                          <RepeatingContent item xs={12}>
                            <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                              <Grid item lg={4} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                                <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                                  Product
                                </Typography>
                                <CustomTextField
                                  rows={1}
                                  fullWidth
                                  multiline
                                  placeholder='Product Code'
                                  {...register(`product.${index}.code`, { required: true })}
                                />
                                <CustomTextField
                                  rows={1}
                                  fullWidth
                                  multiline
                                  sx={{ mt: 3.5 }}
                                  placeholder='Title'
                                  {...register(`product.${index}.title`, { required: true })}
                                />
                              </Grid>
                              <Grid item lg={3} md={5} xs={12} sx={{ px: 4, my: { md: 0, xs: 4 } }}>
                                <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                                  Unit
                                </Typography>
                                <CustomTextField
                                  placeholder='Unit'
                                  {...register(`product.${index}.unit`, { required: true })}
                                />
                              </Grid>
                              <Grid item lg={3} md={5} xs={6} sx={{ px: 4, my: { md: 0, xs: 4 } }}>
                                <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                                  Quantity
                                </Typography>
                                <CustomTextField
                                  placeholder='Unit'
                                  {...register(`product.${index}.unit`, { required: true })}
                                />
                              </Grid>
                              <Grid item lg={2} md={2} xs={6} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                                <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                                  Price
                                </Typography>
                                <CustomTextField
                                  type='text'
                                  inputMode="decimal"
                                  placeholder='1'
                                  InputProps={{ startAdornment: <InputAdornment position='start'>£</InputAdornment> }}
                                  {...register(`product.${index}.price`, { valueAsNumber: true })}
                                />
                              </Grid>
                            </Grid>
                            <OrderAction>
                              <IconButton size='small' onClick={() => remove(index)}>
                                <Icon icon='tabler:x' fontSize='1.25rem' />
                              </IconButton>
                            </OrderAction>
                          </RepeatingContent>
                        </Grid>
                      </Box>
                    )
                  })}

                  <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={12} sx={{ px: 0 }}>
                      <Button variant='contained' onClick={() => append({ title: '', code: '', unit: '', price: 0, quantity: 0 })}>
                        Add Product
                      </Button>
                    </Grid>
                  </Grid>
                </RepeaterWrapper>

                <Divider />

                <TotalAmount
                  theme={theme}
                  control={control}
                  discount={discount}
                  setDiscount={setDiscount}
                  tax={tax}
                  setTax={setTax}
                  productValues={productValues}
                />

                <Divider />

                <CardContent sx={{ px: [6, 10] }}>
                  <InputLabel
                    htmlFor='order-note'
                    sx={{ mb: 2, fontWeight: 500, fontSize: theme.typography.body2.fontSize, lineHeight: 'normal' }}
                  >
                    Note:
                  </InputLabel>
                  <Controller
                    name='orderNote'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        rows={2}
                        fullWidth
                        multiline
                        id='order-note'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.orderNote)}
                        {...(errors.orderNote && { helperText: errors.orderNote.message })}
                        placeholder='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xl={3} md={4} xs={12}>
              <EditActions id={data.order.id} />
            </Grid>
          </Grid>
        </form >
        <Snackbar
          open={open}
          onClose={handleClose}
          autoHideDuration={3000}
          TransitionProps={{ onExited: handleExited }}
          key={messageInfo ? messageInfo.key : undefined}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          message={messageInfo ? messageInfo.message : undefined}
        >
          <Alert
            elevation={3}
            variant='filled'
            onClose={handleClose}
            sx={{ width: '100%' }}
            severity={messageInfo?.key === 'success' ? 'success' : 'error'}
          >
            {messageInfo?.message}
          </Alert>
        </Snackbar>
      </>
    )
  } else {
    return null
  }
}

export default EditCard
