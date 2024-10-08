// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const AdminProfile = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Create Awesome 🙌'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>This is your content page.</Typography>
            <Typography>
              Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
              Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie
              wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

AdminProfile.acl = {
  action: 'read',
  subject: 'adminprofile'
}

export default AdminProfile
