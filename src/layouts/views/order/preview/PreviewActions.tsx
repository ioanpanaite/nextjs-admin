// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  id: number | undefined
  toggleAddPaymentDrawer: () => void
  toggleSendOrderDrawer: () => void
}

const PreviewActions = ({ id, toggleSendOrderDrawer, toggleAddPaymentDrawer }: Props) => {
  const userAuth = useAuth()

  return (
    <Card>
      <CardContent>
        <Button fullWidth variant='contained' onClick={toggleSendOrderDrawer} sx={{ mb: 2, '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:send' />
          Send Order
        </Button>
        <Button fullWidth sx={{ mb: 2 }} color='secondary' variant='tonal'>
          Download
        </Button>
        <Button
          fullWidth
          sx={{ mb: 2 }}
          target='_blank'
          variant='tonal'
          component={Link}
          color='secondary'
          href={`/${userAuth.user?.role}/order/print/${id}`}
        >
          Print
        </Button>
        <Button
          fullWidth
          sx={{ mb: 2 }}
          variant='tonal'
          component={Link}
          color='secondary'
          href={`/${userAuth.user?.role}/order/edit/${id}`}
        >
          Edit Order
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
