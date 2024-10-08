// ** React Imports
import { useCallback, MouseEvent, useState, useEffect } from 'react'

// ** Context Imports
import Link from 'next/link'

import { RootState, AppDispatch } from 'src/store'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Menu, MenuItem, SelectChangeEvent } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ThemeColor } from 'src/@core/layouts/types'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'

import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch, useSelector } from 'react-redux'
import { UsersType } from 'src/types/apps/userTypes'
import DialogEditUserInfo from 'src/components/pages/accounts/DialogEditUserInfo'
import UserSuspendDialog from 'src/components/pages/accounts/UserSuspendDialog'
import { useRouter } from 'next/router'
import TableHeader from 'src/layouts/views/promotions/TableHeader'
import AddPromotionDrawer from 'src/layouts/views/promotions/AddPromotionDrawer'
import { addPromotion, deletePromotion, fetchData, updatePromotion } from 'src/store/apps/promotion'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Status } from 'src/context/types'

interface PromotionType {
  id: string
  title: string
  description: string
  ruleValidDate: string
  percentAmount: string
  status: string
  createdAt: string
  updatedAt: string
}

interface CellType {
  row: PromotionType
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
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
  percentAmount: '',
}

const PromotionDialog = ({ id, openEdit, handleEditClose }: { id: string | number, openEdit: boolean, handleEditClose: () => void }) => {
  const [status, setStatus] = useState<string>('active')

  const store = useSelector((state: RootState) => state.promotion)
  const dispatch = useDispatch<AppDispatch>()

  const {
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const storePromotion = store.allData.find((v: PromotionType) => v.id === id)
    if (storePromotion) {
      const promo = storePromotion as PromotionType
      reset({
        title: promo?.title || '',
        description: promo?.description || '',
        ruleValidDate: promo?.ruleValidDate || '',
        percentAmount: promo?.percentAmount || ''
      })
      setStatus(promo?.status as string)
    }
  }, [])


  const handleDialogue = async () => {
    const promoData = { ...control._formValues, id, status }
    try {
      const result = await dispatch(updatePromotion(promoData)).unwrap()
      reset()
      handleEditClose()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Dialog
      open={openEdit}
      onClose={handleEditClose}
      aria-labelledby='user-view-edit'
      aria-describedby='user-view-edit-description'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
    >
      <DialogTitle
        id='user-view-edit'
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        Edit Price & Promotions
      </DialogTitle>

      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Updating promotion details will receive a privacy audit.
        </DialogContentText>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Title'
                  error={Boolean(errors.title)}
                  {...(errors.title && { helperText: errors.title.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Description'
                  error={Boolean(errors.description)}
                  {...(errors.description && { helperText: errors.description.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='ruleValidDate'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='date'
                  label='Rule Valid Date'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.ruleValidDate)}
                  {...(errors.ruleValidDate && { helperText: errors.ruleValidDate.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='percentAmount'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label='Percent Amount'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.percentAmount)}
                  {...(errors.percentAmount && { helperText: errors.percentAmount.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
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
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button onClick={() => handleDialogue()} variant='contained' sx={{ mr: 2 }}>
          Submit
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleEditClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const handleEditClose = () => setOpenEdit(false)

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)
  const dispatch = useDispatch<AppDispatch>()

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEditPromotion = async () => {
    handleRowOptionsClose()
    setOpenEdit(true)
  }

  const handleDelete = async () => {
    try {
      const result = await dispatch(deletePromotion({ id })).unwrap()
      handleEditClose()
    } catch (error) {
      console.log(error)
    }
    handleRowOptionsClose()
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
        <MenuItem onClick={handleEditPromotion} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
      <PromotionDialog id={id} openEdit={openEdit} handleEditClose={handleEditClose} />
    </>
  )
}

// Define table columns
const columns: GridColDef[] = [
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Title',
    field: 'title',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.title}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Description',
    field: 'description',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.description}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'dateApplied',
    headerName: 'Date Applied',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {(row.createdAt.split('T'))[0]}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'updatedAt',
    minWidth: 120,
    headerName: 'Updated Date',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {(row.updatedAt.split('T'))[0]}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Rule Valid Date',
    field: 'ruleValidDate',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.ruleValidDate}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Percent Or Amount',
    field: 'percentOrAmount',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.percentAmount}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.status}
          color={userStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
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

const Promotions = () => {
  const [value, setValue] = useState<string>('')
  const [addPromoOpen, setPromoOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.promotion)

  useEffect(() => {
    dispatch(
      fetchData({ q: value, })
    )
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddPromoDrawer = () => setPromoOpen(!addPromoOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddPromoDrawer} />
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
          />
        </Card>
      </Grid>

      <AddPromotionDrawer open={addPromoOpen} toggle={toggleAddPromoDrawer} />
    </Grid>
  )
}

Promotions.acl = {
  action: 'read',
  subject: 'admin-promotions'
}

export default Promotions
