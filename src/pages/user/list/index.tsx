// ** React Imports
import { useCallback, MouseEvent, useState, useEffect } from 'react'

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
import { Box, Divider, IconButton, Menu, MenuItem, SelectChangeEvent } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ThemeColor } from 'src/@core/layouts/types'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'

import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch, useSelector } from 'react-redux'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from '../../../components/pages/accounts/TableHeader'
import { fetchData, getUser, updateUser } from 'src/store/apps/user'
import AddUserDrawer from 'src/components/pages/accounts/AddUserDrawer'
import DialogEditUserInfo from 'src/components/pages/accounts/DialogEditUserInfo'
import UserSuspendDialog from 'src/components/pages/accounts/UserSuspendDialog'
import { Plan, Role, Status, UserDataType } from 'src/context/types'
import { useRouter } from 'next/router'

interface CellType {
  row: UsersType
}

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  supplier: { icon: 'tabler:edit', color: 'info' },
  buyer: { icon: 'tabler:user', color: 'warning' }
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const renderClient = (row: UsersType) => {
  if (row.avatar && row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
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

  const handleUserEditInfo = async () => {
    handleRowOptionsClose()
    setShow(true)
    const storeUser = getUser(store, id)
    setUser(storeUser);
  }

  const handleDelete = () => {
    const storeUser = getUser(store, id)
    setUser(storeUser);
    handleRowOptionsClose()
    setSuspendDialogOpen(true)
  }

  const handleUserView = () => {
    const storeUser = getUser(store, id)
    const { ...data } = storeUser
    if (data.hasOwnProperty('password')) {
      data.password = '*****'
    }
    window.localStorage.setItem('selected_user', JSON.stringify(data))
    handleRowOptionsClose()
    router.push('/user/view/account')
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
    flex: 0.25,
    minWidth: 280,
    field: 'fullName',
    headerName: 'User',
    renderCell: ({ row }: CellType) => {
      const { fullName, email } = row

      const handleUserView = () => {
        // Set seelcted user
        const { ...user } = row
        if (user.hasOwnProperty('password')) {
          user.password = '*****'
        }
        window.localStorage.setItem('selected_user', JSON.stringify(user))
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='/user/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={handleUserView}
            >
              {fullName}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 170,
    headerName: 'Role',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            sx={{ mr: 4, width: 30, height: 30 }}
            color={(userRoleObj[row.role].color as ThemeColor) || 'primary'}
          >
            <Icon icon={userRoleObj[row.role].icon} />
          </CustomAvatar>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Plan',
    field: 'currentPlan',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.currentPlan}
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

const UserAccounts = () => {
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setPlan(e.target.value as string)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setStatus(e.target.value as string)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Role'
                  SelectProps={{
                    value: role,
                    displayEmpty: true,
                    onChange: e => handleRoleChange(e)
                  }}
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  {
                    Object.keys(Role).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
                  }
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Plan'
                  SelectProps={{
                    value: plan,
                    displayEmpty: true,
                    onChange: e => handlePlanChange(e)
                  }}
                >
                  <MenuItem value=''>Select Plan</MenuItem>
                  {
                    Object.keys(Plan).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
                  }
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Status'
                  SelectProps={{
                    value: status,
                    displayEmpty: true,
                    onChange: e => handleStatusChange(e)
                  }}
                >
                  <MenuItem value=''>Select Status</MenuItem>
                  {
                    Object.keys(Status).map((val) => <MenuItem key={val} value={val.toLowerCase()}>{val}</MenuItem>)
                  }
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default UserAccounts
