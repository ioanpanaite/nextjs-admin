import { useCallback, MouseEvent, useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { addMember, fetchData } from 'src/store/apps/teams'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import PageHeader from 'src/@core/components/page-header'
import { TeamRowType } from 'src/types/apps/teamTypes'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material'
import TeamTableHeader from './TeamTableHeader'

interface CellType {
  row: TeamRowType
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.25,
    field: 'member',
    minWidth: 240,
    headerName: 'Member',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {row.name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {row.memberEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.35,
    minWidth: 290,
    field: 'role',
    headerName: 'Role',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.role}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 210,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.status}</Typography>
  }
]

const Teams = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [open, setOpen] = useState<boolean>(false)
  const handleInviteToggle = () => setOpen(!open)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.teams)

  useEffect(() => {
    dispatch(
      fetchData({
        q: value
      })
    )
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleEditPermission = (name: string) => {
    setEditValue(name)
    setEditDialogOpen(true)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const handleConfirmation = (status: string) => {
    console.log(status, '===handle confirmation')
  }

  const handleInviteMember = (data: any) => {
    dispatch(addMember(data))
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleEditPermission(row.memberEmail)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PageHeader
            title={
              <Box sx={{ background: 'white', p: 2 }}>
                <Typography variant='h6'>
                  You can give members different roles depending on what they need to do on Nom
                </Typography>
              </Box>
            }
            subtitle={
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                1 team members
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TeamTableHeader
              value={value}
              handleFilter={handleFilter}
              open={open}
              handleDialogToggle={handleInviteToggle}
              handleInviteMember={handleInviteMember}
            />
            <DataGrid
              autoHeight
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
                      onboard your team member on NOM
                    </Typography>
                    <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>

                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                      <Button onClick={handleInviteToggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                        <Icon fontSize='1.125rem' icon='tabler:plus' />
                        Invite team member
                      </Button>
                    </Box>
                  </Box>
                ),
                noResultsOverlay: () => (
                  <Box sx={{ p: 2, display: 'block', alignItems: 'center' }}>
                    <Typography variant='h5' sx={{ pt: 2, textAlign: 'center' }}>
                      onboard your team member on NOM
                    </Typography>
                    <Typography variant='body2' sx={{ pb: 2, color: 'text.disabled', textAlign: 'center' }}>

                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                      <Button onClick={handleInviteToggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                        <Icon fontSize='1.125rem' icon='tabler:plus' />
                        Invite team member
                      </Button>
                    </Box>
                  </Box>
                )
              }}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Edit Member
          </Typography>
          <Typography variant='body2'>Edit permission as per your requirements.</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
              Yes, Delete Member!
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => handleConfirmation('cancel')}>
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Teams
