// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
// import { OrderType } from 'src/types/apps/orderTypes'

// ** Components Imports
import UserViewLeft from './UserViewLeft'
import UserViewRight from './UserViewRight'

type Props = {
  tab: string
}

const UserView = ({ tab }: Props) => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} />
      </Grid>
    </Grid>
  )
}

UserView.acl = {
  action: 'read',
  subject: 'userview-page'
}

export default UserView
