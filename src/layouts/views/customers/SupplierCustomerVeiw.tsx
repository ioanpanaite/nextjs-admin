// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteOrder } from 'src/store/apps/order'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { OrderStatus, OrderType } from 'src/types/apps/orderTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TableHeader from 'src/layouts/views/order/list/TableHeader'
import OrderDeleteDialog from 'src/layouts/views/order/list/OrderDeleteDialog'
import { Button, ButtonGroup } from '@mui/material'
import OrderRefundDialog from 'src/layouts/views/order/list/OrderRefundDialog'
import AddCustomerDrawer from 'src/layouts/views/customers/AddCustomerDrawer'
import { fetchOrders } from 'src/store/apps/customer/orders'
import { fetchCustomerDetail } from 'src/store/apps/customer'

interface OrderStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: OrderType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

// ** Vars
const OrderStatusObj: OrderStatusObj = {
  sent: { color: 'secondary', icon: 'tabler:circle-check' },
  opened: { color: 'success', icon: 'tabler:circle-half-2' },
  processing: { color: 'primary', icon: 'tabler:device-floppy' },
  unopened: { color: 'error', icon: 'tabler:alert-circle' },
  refunded: { color: 'error', icon: 'tabler:alert-circle' },
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 60,
    headerName: 'ID',
    renderCell: ({ row }: CellType) => (
      <Typography component={LinkStyled} href={`/supplier/order/preview/${row.id}`}>{`#${row.id}`}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'orderStatus',
    renderHeader: () => <Icon icon='tabler:trending-up' />,
    renderCell: ({ row }: CellType) => {
      const { dueDate, orderStatus } = row

      const color = OrderStatusObj[orderStatus] ? OrderStatusObj[orderStatus].color : 'primary'

      return (
        <Tooltip
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                {orderStatus}
              </Typography>
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Due Date:
              </Typography>{' '}
              {dueDate}
            </div>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: '1.875rem', height: '1.875rem' }}>
            <Icon icon={OrderStatusObj[orderStatus]?.icon} />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`£${row.total || 0}`}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 140,
    field: 'issuedDate',
    headerName: 'Issued Date',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.issuedDate}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'dueDate',
    headerName: 'Due Date',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.dueDate}</Typography>
  }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const SupplierCustomerVeiw = ({ id }: { id: string }) => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [deleteOrderId, setDeleteOrderId] = useState<number>(0)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [refundOrderId, setRefundOrderId] = useState<number>(0)
  const [openRefundDialog, setOpenRefundDialog] = useState<boolean>(false)

  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.customerOrders)
  const customerStore = useSelector((state: RootState) => state.customer)

  useEffect(() => {
    dispatch(
      fetchOrders({
        dates,
        q: value,
        status: statusValue,
        id: id
      })
    )
    dispatch(
      fetchCustomerDetail({
        _id: id
      })
    )
  }, [dispatch, statusValue, value, dates, id])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleStatusValue = (e: SelectChangeEvent<unknown>) => {
    setStatusValue(e.target.value as string)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleDeleteOrder = (id: number) => {
    setDeleteOrderId(id)
    setOpenDialog(true)
  }

  const handleRefund = (id: number) => {
    setRefundOrderId(id)
    setOpenRefundDialog(true)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Print'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/supplier/order/preview/${row.id}`}
            >
              <Icon icon='tabler:download' />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/supplier/order/print/${row.id}`}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
          <OptionsMenu
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: 'Refund',
                icon: <Icon icon='tabler:receipt-refund' fontSize={20} />,
                menuItemProps: {
                  sx: { py: 2 },
                  onClick: () => handleRefund(row.id)
                }
              },
              {
                text: 'Edit',
                href: `/supplier/order/edit/${row.id}`,
                icon: <Icon icon='tabler:edit' fontSize={20} />
              }
            ]}
          />
        </Box>
      )
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box style={{ display: 'flex' }}>
                <Typography variant={"h4"} style={{ flexGrow: 1 }}>Customer</Typography>
                <Button variant='outlined' style={{ marginRight: '0.51rem' }} color='primary'>Edit</Button>
                <Button variant='outlined' style={{ marginRight: '0.51rem' }} color="success">Chat</Button>
                <Button variant='outlined' style={{ marginRight: '0.51rem' }} color='error'>Block</Button>
                {customerStore.detail.siteName == 'test' && (
                  <Button variant='outlined' color='warning'>Unblock</Button>
                )}
              </Box>
              <Box style={{ display: 'flex' }}>
                <Box sx={{ mr: 5 }}>
                  <>
                    {customerStore.detail.avatarImage ?
                      <ImgStyled src={customerStore.detail.avatarImage} alt='Product Image' /> :
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          display: 'flex',
                          borderRadius: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                        }}
                      >
                        <Icon icon='tabler:photo-circle' fontSize='1.2rem' />
                      </Box>
                    }
                  </>
                </Box>
                <Box sx={{ mr: 5 }}>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Business Name : {customerStore.detail.username}</Typography>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Email : {customerStore.detail.email}</Typography>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Phone: {customerStore.detail.contact}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Site Name : {customerStore.detail.siteName}</Typography>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Address : {customerStore.detail.deliveryAddress}</Typography>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Account ID: {customerStore.detail.accountId}</Typography>
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Order Status'
                    SelectProps={{ value: statusValue, onChange: e => handleStatusValue(e) }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    {
                      Object.keys(OrderStatus).map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)
                    }
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Order Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              rows={store.data}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
              sx={{ height: 300 }}
              slots={{
                noRowsOverlay: () => (
                  <Box sx={{ p: 2, display: 'block', alignItems: 'center' }}>
                    <Typography variant='h5' sx={{ pt: 2, textAlign: 'center' }}>
                      onboard your customers to see more orders on NOM
                    </Typography>
                    <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>
                      It is completely free and means that you can manage al your orders in one place
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                      <Button onClick={toggleAddCustomerDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                        <Icon fontSize='1.125rem' icon='tabler:plus' />
                        Set up customer
                      </Button>
                    </Box>
                  </Box>
                ),
                noResultsOverlay: () => (
                  <Box sx={{ p: 2, display: 'block', alignItems: 'center' }}>
                    <Typography variant='h5' sx={{ pt: 2, textAlign: 'center' }}>
                      onboard your customers to see more orders on NOM
                    </Typography>
                    <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>
                      It is completely free and means that you can manage al your orders in one place
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                      <Button onClick={toggleAddCustomerDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                        <Icon fontSize='1.125rem' icon='tabler:plus' />
                        Set up customer
                      </Button>
                    </Box>
                  </Box>
                )
              }}
            />
          </Card>
        </Grid>
      </Grid>

      <OrderDeleteDialog orderId={deleteOrderId} open={openDialog} setOpen={setOpenDialog} />
      <OrderRefundDialog orderId={refundOrderId} open={openRefundDialog} setOpen={setOpenRefundDialog} />
      <AddCustomerDrawer open={addCustomerOpen} toggle={toggleAddCustomerDrawer} />
    </DatePickerWrapper>
  )
}

export default SupplierCustomerVeiw
