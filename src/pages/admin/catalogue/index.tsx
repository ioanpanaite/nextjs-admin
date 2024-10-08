// ** React Imports
import { MouseEvent, useCallback, useEffect, useState } from 'react'

import { AppDispatch, RootState } from 'src/store'

// ** MUI Imports
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { useDispatch, useSelector } from 'react-redux'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import AddCatalogueDrawer from 'src/layouts/views/catalogue/AddCatalogueDrawer'
import CatalogueDialog from 'src/layouts/views/catalogue/CatalogueDialog'
import DialogEditCatalogue from 'src/layouts/views/catalogue/DialogEditCatalogue'
import FileUploaderRestrictions from 'src/layouts/views/catalogue/FileUploaderRestrictions'
import TableHeader from 'src/layouts/views/catalogue/TableHeader'
import { fetchData } from 'src/store/apps/catalogue'

interface CatalogueType {
  id: string
  product_code: string
  product_name: string
  description: string
  product_size_per_unit: string
  unit_price: string
  price_per_unit_measure: string
  quantity: string
  supplier_sku: string
  manufacturer: string
}

interface CellType {
  row: CatalogueType
}

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const [show, setShow] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleUserEditInfo = async () => {
    handleRowOptionsClose()
    setShow(true)
  }

  const handleDelete = () => {
    handleRowOptionsClose()
    setSuspendDialogOpen(true)
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
        <MenuItem onClick={handleUserEditInfo} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>

      <DialogEditCatalogue id={id} show={show} setShow={setShow} />
      <CatalogueDialog id={id} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
    </>
  )
}

// Define table columns
const columns: GridColDef[] = [
  {
    flex: 0.15,
    minWidth: 70,
    headerName: 'code',
    field: 'product_code',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.product_code}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 70,
    headerName: 'name',
    field: 'product_name',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.product_name}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 70,
    headerName: 'description',
    field: 'description',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.description}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 70,
    headerName: 'size',
    field: 'product_size_per_unit',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.product_size_per_unit}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 70,
    headerName: 'Unit price',
    field: 'unit_price',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.unit_price}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: 'price / measure (£)',
    field: 'price_per_unit_measure',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.price_per_unit_measure}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: 'quantity',
    field: 'quantity',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.quantity}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'supplier sku',
    field: 'supplier_sku',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.supplier_sku}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'manufacturer',
    field: 'manufacturer',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.manufacturer}
        </Typography>
      )
    }
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

const Catalogue = () => {
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])

  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const toggleAddProductDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.catalogue)

  useEffect(() => {
    dispatch(
      fetchData({ q: value })
    )
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <DropzoneWrapper>
              <FileUploaderRestrictions />
            </DropzoneWrapper>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={3} sm={6}>
            <Card>
              <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ width: 30, height: 30 }}>
                  <Icon icon={'tabler:align-box-left-bottom'} fontSize={30} />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ mb: 1, color: 'text.primary' }}>Total solid</Typography>
                  <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                    %
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} sm={6}>
            <Card>
              <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ width: 30, height: 30 }}>
                  <Icon icon={'tabler:tag'} fontSize={30} />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ mb: 1, color: 'text.primary' }}>Revenue</Typography>
                  <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                    %
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} sm={6}>
            <Card>
              <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ width: 30, height: 30 }}>
                  <Icon icon={'tabler:camera'} fontSize={30} />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ mb: 1, color: 'text.primary' }}>Profit</Typography>
                  <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                    %
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} sm={6}>
            <Card>
              <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ width: 30, height: 30 }}>
                  <Icon icon={'tabler:arrow-back-up'} fontSize={30} />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ mb: 1, color: 'text.primary' }}>Most popular by month</Typography>
                  <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                    %
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} selectedRows={selectedRows} setSelectedRows={setSelectedRows} handleFilter={handleFilter} toggle={toggleAddProductDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.data}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={rows => setSelectedRows(rows)}
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
                    <Button onClick={toggleAddProductDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Add product
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
                    <Button onClick={toggleAddProductDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                      Add product
                    </Button>
                  </Box>
                </Box>
              )
            }}
          />
        </Card>
      </Grid>

      <AddCatalogueDrawer open={addCustomerOpen} toggle={toggleAddProductDrawer} />
    </Grid>
  )
}

Catalogue.acl = {
  action: 'read',
  subject: 'admin-catalogue-page'
}

export default Catalogue
