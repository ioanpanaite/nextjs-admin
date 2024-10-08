// ** MUI Imports
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { AppDispatch } from 'src/store'
import { bulkCatalogue } from 'src/store/apps/catalogue'


interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  toggle: () => void
  setSelectedRows: (val: GridRowId[]) => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value, selectedRows, setSelectedRows, toggle } = props
  const [action, setAction] = useState<string>('Actions')
  const [open, setOpen] = useState<boolean>(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => {
    setSelectedRows([])
    setOpen(false)
  }

  useEffect(() => {
    if (selectedRows && selectedRows.length === 0) {
      setAction('Actions')
    }
  }, [selectedRows])

  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAction(event.target.value)

    if (event.target.value === 'Publish') {
      dispatch(bulkCatalogue({ action: 'Publish', list: selectedRows }))
      setSelectedRows([])
    } else if (event.target.value === 'Unpublish') {
      dispatch(bulkCatalogue({ action: 'Unpublish', list: selectedRows }))
      setSelectedRows([])
    } else if (event.target.value === 'Delete') {
      handleClickOpen()
    }
  }

  const handleAgree = () => {
    dispatch(bulkCatalogue({ action: 'Delete', list: selectedRows }))
    setSelectedRows([])
    handleClose()
  }

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <CustomTextField
        select
        defaultValue='Actions'
        sx={{ mr: 4, mb: 2 }}
        onChange={handleChange}
        SelectProps={{
          displayEmpty: true,
          disabled: selectedRows && selectedRows.length === 0,
          value: action,
        }}
      >
        <MenuItem disabled value='Actions'>
          Actions
        </MenuItem>
        <MenuItem value='Publish'>Publish</MenuItem>
        <MenuItem value='Unpublish'>Unpublish</MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
      </CustomTextField>

      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Tooltip
          arrow={true}
          placement={'top'}
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                onboard your customers to see more orders on NOM
              </Typography>
            </div>
          }
        >
          <Button onClick={toggle} variant='contained' sx={{ mr: '10px', '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            Add product
          </Button>
        </Tooltip>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              Are you sure to delete selected catalogues?
            </Typography>
            <Typography>You won't be able to revert catalogue!</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={handleAgree}>
            Yes, Delete catalogue
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


export default TableHeader
