// ** React Imports
import { useCallback, MouseEvent, useState, useEffect } from 'react'

// ** Context Imports
import Link from 'next/link'

import { RootState, AppDispatch } from 'src/store'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch, useSelector } from 'react-redux'
import DialogEditUserInfo from 'src/components/pages/accounts/DialogEditUserInfo'
import UserSuspendDialog from 'src/components/pages/accounts/UserSuspendDialog'
import { UserDataType } from 'src/context/types'
import { useRouter } from 'next/router'
import AddProductDrawer from './AddProductDrawer'
import { fetchAllProducts, fetchProducts } from 'src/store/apps/product'
import toast from 'react-hot-toast'

interface ProductType {
  id: string
  code: string
  name: string
  unit: string
  price: string
}

interface CellType {
  row: ProductType
}

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const [show, setShow] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const store = useSelector((state: RootState) => state.user)
  const [user, setUser] = useState<UserDataType>()
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

  const handleDelete = () => {
    console.log('handle delete')
  }

  const handleProductEditInfo = () => {
    console.log('handle edit')

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
        <MenuItem onClick={handleProductEditInfo} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>

      <DialogEditUserInfo show={show} setShow={setShow} user={user} />
      <UserSuspendDialog user={user} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
    </>
  )
}

// Define table columns
const columns: GridColDef[] = [
  {
    flex: 0.1,
    minWidth: 70,
    field: 'code',
    headerName: 'Code',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.code}</Typography>
  },
  {
    flex: 0.15,
    field: 'name',
    minWidth: 170,
    headerName: 'Name',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'unit',
    headerName: 'Unit',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.unit}</Typography>
  },
  {
    flex: 0.15,
    field: 'price',
    minWidth: 170,
    headerName: 'Price',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.price}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]


interface CustomerType {
  siteName: string
  address: string
  accountId: string
}

interface ProductParamType {
  data: CustomerType
  handleBack: () => void
  handleNext: () => void
}

const ProductList = (props: ProductParamType) => {
  const { data, handleBack, handleNext } = props
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.product)

  useEffect(() => {
    dispatch(fetchProducts({ search: data.siteName, type: 'site' }))
  }, [dispatch])

  const toggleAddProductDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  const handleProductNext = () => {
    if (store.data.length > 0) {
      handleNext()
    } else {
      toast.error("You should add product at least one.")
    }
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ rowGap: 2, p: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'end', alignItems: 'center' }}>
            <Button onClick={toggleAddProductDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Add New Product
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
                    onboard your products to see on NOM
                  </Typography>
                  <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>
                    you will receive new customer requests at this email address
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <Button onClick={toggleAddProductDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Add New Product
                    </Button>
                  </Box>
                </Box>
              ),
              noResultsOverlay: () => (
                <Box sx={{ p: 2, display: 'block', alignItems: 'center' }}>
                  <Typography variant='h5' sx={{ pt: 2, textAlign: 'center' }}>
                    onboard your products to see on NOM
                  </Typography>
                  <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>
                    you will receive new customer requests at this email address
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <Button onClick={toggleAddProductDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Add New Product
                    </Button>
                  </Box>
                </Box>
              )
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='tonal' color='secondary' onClick={handleBack}>
          Back
        </Button>
        <Button variant='contained' onClick={handleProductNext}>
          Submit
        </Button>
      </Grid>

      <AddProductDrawer customerData={data} open={addCustomerOpen} toggle={toggleAddProductDrawer} />
    </Grid>
  )
}

ProductList.acl = {
  action: 'read',
  subject: 'supplier-ProductList'
}

export default ProductList
