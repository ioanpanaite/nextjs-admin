// ** React Imports
import { ElementType, useCallback, useEffect, useState } from 'react'

import { AppDispatch, RootState } from 'src/store'

// ** MUI Imports
import { Box, Button, ButtonProps, IconButton, Tooltip, styled } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { useDispatch, useSelector } from 'react-redux'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import CatalogueDetail from 'src/components/pages/supplier/catalogue/CatalogueDetail'
import CatalogueDialog from 'src/layouts/views/catalogue/CatalogueDialog'
import FileUploaderRestrictions from 'src/layouts/views/catalogue/FileUploaderRestrictions'
import TableHeader from 'src/layouts/views/catalogue/TableHeader'
import { CatalogueType, fetchData, setCatalogueDetailOpen } from 'src/store/apps/catalogue'

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

interface CellType {
  row: CatalogueType
}

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const [show, setShow] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [catalogueDetailOpen, setCatalogueDetailOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.catalogue)

  const toggleAddProductDrawer = () => setCatalogueDetailOpen(!catalogueDetailOpen);

  const handleUserEditInfo = async () => {
    setShow(true)
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title='Edit'>
          <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={toggleAddProductDrawer}>
            <Icon icon='tabler:edit' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete'>
          <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={handleDelete}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Tooltip>
      </Box>

      {/* <DialogEditCatalogue id={id} show={show} setShow={setShow} /> */}
      <CatalogueDetail open={catalogueDetailOpen} toggle={toggleAddProductDrawer} id={id} />
      <CatalogueDialog id={id} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
    </>
  )
}

// Define table columns
const columnsList: GridColDef[] = [
  {
    flex: 0.15,
    minWidth: 100,
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
    minWidth: 100,
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
    minWidth: 150,
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
    minWidth: 80,
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
    minWidth: 80,
    headerName: 'Order Unit',
    field: 'order_unit',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.order_unit}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 80,
    headerName: 'Price',
    field: 'unit_price',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.unit_price_delivery}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 60,
    headerName: 'rrp',
    field: 'rrp',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.rrp}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 80,
    headerName: 'unit of measure',
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
    headerName: 'Stock',
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
    headerName: 'Sku',
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
    headerName: 'ingredients',
    field: 'ingredients',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.ingredients}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'nutritional information per serving',
    field: 'nutritional_value',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.nutritional_value}
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
    minWidth: 120,
    headerName: 'category',
    field: 'category',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.category}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 120,
    headerName: 'sub-category',
    field: 'sub_category',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.sub_category}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: 'minimum order',
    field: 'minimum_order_quantity',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.minimum_order_quantity}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Diet',
    field: 'diet',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.diet}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Shelf Life ',
    field: 'shelf_life',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.shelf_life}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Product Values',
    field: 'brand_supplier_values',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.brand_supplier_values}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Storage',
    field: 'storage',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.storage}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Production',
    field: 'production',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.production}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Allergen',
    field: 'allergen',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.allergen}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 210,
    headerName: 'Ship Window',
    field: 'ship_window',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.ship_window}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Lead Time',
    field: 'lead_time',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.lead_time}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: 'Promotion',
    field: 'promotion',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.promotion}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    headerName: 'Product Origin',
    field: 'product_origin',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.product_origin}
        </Typography>
      )
    }
  },
]

const Catalogue = () => {
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])

  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)

  // const toggleAddProductDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.catalogue)

  const toggleAddProductDrawer = () => dispatch(setCatalogueDetailOpen());

  useEffect(() => {
    dispatch(
      fetchData({ q: value })
    )
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const columns = [
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    },
    {
      flex: 0.1,
      minWidth: 80,
      headerName: 'Visible',
      field: 'visible',
      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {Object.hasOwn(row, 'visible') && row.visible ?
                <Icon icon={'tabler:eye'} fontSize={30} /> :
                <Icon icon={'tabler:eye-off'} fontSize={30} />}
            </Typography>
          </>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 80,
      headerName: 'Image',
      field: 'product_image',
      renderCell: ({ row }: CellType) => {
        return (
          <>
            {row.product_image ?
              <CustomAvatar src={row.product_image} sx={{ mr: 2.5, width: 38, height: 38 }} /> :
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
    ...columnsList
  ]

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

      {/* <AddCatalogueDrawer open={addCustomerOpen} toggle={toggleAddProductDrawer} /> */}
      <CatalogueDetail open={store.catalogueDetailOpen} toggle={toggleAddProductDrawer} id={0} />
    </Grid>
  )
}

Catalogue.acl = {
  action: 'read',
  subject: 'catalogue-page'
}

export default Catalogue
