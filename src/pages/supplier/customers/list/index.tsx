// ** React Imports
import { useCallback, MouseEvent, useState, useEffect, SyntheticEvent } from 'react'

// ** Context Imports
import Link from 'next/link'

import { RootState, AppDispatch } from 'src/store'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box, Button, Divider, IconButton, Menu, MenuItem, SelectChangeEvent, styled } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch, useSelector } from 'react-redux'
import DialogEditCustomer from 'src/components/pages/supplier/DialogEditCustomer'
import DialogCreateCustomer from 'src/components/pages/supplier/DialogCreateCustomer'
import { Plan, Role, Status, TeamRole, UserDataType } from 'src/context/types'
import { useRouter } from 'next/router'
import { TeamCustomerType } from 'src/store/apps/teams'
import { fetchCustomer, getCustomer, setUpdateResult } from 'src/store/apps/customer'
import AddCustomerDrawer from 'src/layouts/views/customers/AddCustomerDrawer'
import DialogBlockCustomer from 'src/components/pages/supplier/DialogBlockCustomer'
import { SnackbarMessage } from 'src/types/apps/userTypes'
import { Alert, Snackbar } from '@mui/material'
import DialogDeleteCustomer from 'src/components/pages/supplier/DialogDeleteCustomer'

interface CustomerView {
  id: string
  email: string
  siteName: string
  accountId: string
  blocked: number
  week_count: string
  week_count_12: string
  trend_products_12: string
  trend_spent_12: string
  username: string
  avatarImage: string
}

const roleDesc = new Map()
roleDesc.set('admin', "administrator to manage team")
roleDesc.set('processor', "processor to manage orders etc")
roleDesc.set('representative', "representative for supplier")
roleDesc.set('driver', "driver to deliver something etc")

interface CellType {
  row: CustomerView
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))


const RowOptions = ({ id, blocked }: { id: number | string, blocked: string | number }) => {
  // ** Hooks
  const [show, setShow] = useState<boolean>(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const store = useSelector((state: RootState) => state.customer)
  const [user, setUser] = useState<any>()
  const router = useRouter()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }
  const handleUserView = () => {
    handleRowOptionsClose()
    router.push(`/supplier/customers/view/${id}`)
  }

  const handleUserEditInfo = async () => {
    handleRowOptionsClose()
    setShow(true)
    const customer = getCustomer(store, id);
    setUser(customer);
  }

  const handleBlock = () => {
    const customer = getCustomer(store, id);
    setUser(customer);
    handleRowOptionsClose()
    setBlockDialogOpen(true)
  }

  const handleDelete = () => {
    const customer = getCustomer(store, id);
    setUser(customer);
    handleRowOptionsClose()
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleUserView}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleUserEditInfo} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        {blocked == 1 ? (
          <MenuItem onClick={handleBlock} sx={{ '& svg': { mr: 2 } }}>
            <CheckCircleOutlineOutlinedIcon fontSize='small' />
            UnBlock
          </MenuItem>
        ) : (
          <MenuItem onClick={handleBlock} sx={{ '& svg': { mr: 2 } }}>
            <BlockOutlinedIcon fontSize='small' />
            Block
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <DeleteOutlineOutlinedIcon fontSize='small' />
          Delete
        </MenuItem>
      </Menu>

      <DialogEditCustomer show={show} setShow={setShow} user={user} />
      <DialogBlockCustomer user={user} open={blockDialogOpen} setOpen={setBlockDialogOpen} />
      <DialogDeleteCustomer user={user} open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
    </>
  )
}

// Define table columns
const columns: GridColDef[] = [
  {
    flex: 0.1,
    minWidth: 80,
    headerName: 'Image',
    field: 'product_image',
    renderCell: ({ row }: CellType) => {
      return (
        <>
          {row.avatarImage ?
            <CustomAvatar src={row.avatarImage} sx={{ mr: 2.5, width: 38, height: 38 }} /> :
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                borderRadius: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
              }}
            >
              <Icon icon='tabler:photo-circle-plus' fontSize='1.2rem' />
            </Box>
          }
        </>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 70,
    field: 'accountId',
    headerName: 'Account ID',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography component={LinkStyled} href={`/supplier/customers/view/${row.id}`}>{row.accountId}</Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 70,
    field: 'username',
    headerName: 'Business Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography component={LinkStyled} href={`/supplier/customers/view/${row.id}`}>{row.username}</Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'week_count',
    headerName: 'Orders placed this week',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.week_count ? row.week_count : '-'}
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'week_count_12',
    headerName: 'Orders placed in the past 12 weeks',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.week_count_12 ? row.week_count_12 : '-'}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'trend_products_12',
    headerName: 'Trend of products ordered over 12 weeks',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.trend_products_12 ? row.trend_products_12 : '-'}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'trend_spent_12',
    headerName: 'Trend of spend over 12 weeks',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.trend_spent_12 ? row.trend_spent_12 : '-'}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'blocked',
    headerName: 'Active',
    renderCell: ({ row }: CellType) => {
      const blocked = row.blocked;
      if (blocked == 1) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'white', textTransform: 'capitalize' }} style={{ padding: '0.5rem', borderRadius: '5px', background: '#ff6d6d', }}>
              {"Blocked"}
            </Typography>
          </Box>
        )
      } else {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'white', textTransform: 'capitalize' }} style={{ padding: '0.5rem', borderRadius: '5px', background: '#2dd324', }}>
              {"Active"}
            </Typography>
          </Box>
        )
      }
    }
  },
  {
    flex: 0.1,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} blocked={row?.blocked} />
  }
]

const SupplierCustomers = () => {
  // Notification
  const [openSnack, setOpenSnack] = useState<boolean>(false)
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined)
  const handleSanckClose = (event: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
  }
  const handleExited = () => {
    setMessageInfo(undefined)
  }

  const [role, setRole] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.customer)

  const updateStatus = useSelector((state: RootState) => state.customer.updateStatus);
  const updateMessage = useSelector((state: RootState) => state.customer.updateMessage);

  useEffect(() => {
    getData();
  }, [dispatch, tag, value, status])

  useEffect(() => {
    if (updateStatus != '') {
      setMessageInfo({ key: updateStatus, message: updateMessage })
      setOpenSnack(true)

      dispatch(setUpdateResult({
        status: '',
        message: ''
      }))
      getData();
    }
  }, [updateStatus, updateMessage]);

  const getData = () => {
    dispatch(
      fetchCustomer({
        tag,
        q: value,
        status: status
      })
    )
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])

  const handleTagChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setTag(e.target.value as string)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setStatus(e.target.value as string)
  }, [])

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  value={value}
                  sx={{ mr: 4 }}
                  placeholder='Search Customers'
                  onChange={e => handleFilter(e.target.value)}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Status'
                  SelectProps={{
                    value: status,
                    displayEmpty: true,
                    onChange: e => handleStatusChange(e)
                  }}
                >
                  <MenuItem value=''>Select Status</MenuItem>
                  <MenuItem value='0'>Active</MenuItem>
                  <MenuItem value='1'>Blocked</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Filter by tag'
                  SelectProps={{
                    value: tag,
                    displayEmpty: true,
                    onChange: e => handleTagChange(e)
                  }}
                >
                  <MenuItem value=''>Select Tag</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <Box sx={{ rowGap: 2, p: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'end', alignItems: 'center' }}>
            <Button onClick={toggleAddCustomerDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Add New Customer
            </Button>
          </Box>
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{
              noRowsOverlay: () => (
                <Box sx={{ p: 2, display: 'block', alignItems: 'center' }}>
                  <Typography variant='h5' sx={{ pt: 2, textAlign: 'center' }}>
                    onboard your customers to see on NOM
                  </Typography>
                  <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>
                    you will receive new customer requests at this email address
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <Button onClick={toggleAddCustomerDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Add New Customer
                    </Button>
                  </Box>
                </Box>
              ),
              noResultsOverlay: () => (
                <Box sx={{ p: 2, display: 'block', alignItems: 'center' }}>
                  <Typography variant='h5' sx={{ pt: 2, textAlign: 'center' }}>
                    onboard your customers to see on NOM
                  </Typography>
                  <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>
                    you will receive new customer requests at this email address
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <Button onClick={toggleAddCustomerDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Add New Customer
                    </Button>
                  </Box>
                </Box>
              )
            }}
          />
        </Card>
      </Grid>

      {/* <AddCustomerDrawer open={addCustomerOpen} toggle={toggleAddCustomerDrawer} /> */}
      <DialogCreateCustomer show={addCustomerOpen} setShow={setAddCustomerOpen} />
      <Snackbar
        open={openSnack}
        onClose={handleSanckClose}
        autoHideDuration={3000}
        TransitionProps={{ onExited: handleExited }}
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={messageInfo ? messageInfo.message : undefined}
      >
        <Alert
          elevation={3}
          variant='filled'
          onClose={handleSanckClose}
          sx={{ width: '100%' }}
          severity={messageInfo?.key === 'success' ? 'success' : 'error'}
        >
          {messageInfo?.message}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

SupplierCustomers.acl = {
  action: 'read',
  subject: 'supplier-customers'
}

export default SupplierCustomers
