// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AddActions = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Button type='submit' sx={{ mb: 2 }} fullWidth variant='contained' >
              Save
            </Button>
            <Button
              fullWidth
              sx={{ mb: 2 }}
              variant='tonal'
              component={Link}
              color='secondary'
              href='/admin/order/preview/1'
            >
              Preview
            </Button>
            <Button fullWidth variant='tonal' sx={{ mb: 2, '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:send' />
              Send Order
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AddActions
