// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { GridRowId } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Icon from 'src/@core/components/icon'
import { Tooltip, Typography } from '@mui/material'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleSetUpOrder: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, selectedRows, handleSetUpOrder, handleFilter } = props
  const ability = useContext(AbilityContext)

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
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
        SelectProps={{
          displayEmpty: true,
          disabled: selectedRows && selectedRows.length === 0,
          renderValue: selected => ((selected as string)?.length === 0 ? 'Actions' : (selected as string))
        }}
      >
        <MenuItem disabled value='Actions'>
          Actions
        </MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
        <MenuItem value='Edit'>Edit</MenuItem>
        <MenuItem value='Send'>Send</MenuItem>
      </CustomTextField>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Tooltip
          arrow={true}
          placement={'top'}
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                add new orders on NOM
              </Typography>
            </div>
          }
        >
          <Button onClick={handleSetUpOrder} variant='contained' sx={{ mr: '10px', mb: '8px', '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            Create Order
          </Button>
        </Tooltip>

        <CustomTextField
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search Order'
          onChange={e => handleFilter(e.target.value)}
        />
        {ability?.can('manage', 'all') ? (
          <Button sx={{ mb: 2 }} component={Link} variant='contained' href='/admin/order/add'>
            Create Order
          </Button>
        ) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
