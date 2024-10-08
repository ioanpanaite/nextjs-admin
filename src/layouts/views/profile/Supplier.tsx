// ** MUI Components
import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import { Box } from '@mui/system'
import SupplierPayments from './SupplierPayments'
import DetailsOverivew from './DetailsOverivew'
import GoodsServices from './GoodsServices'
import SupplierSocial from './SupplierSocial'
import CompanyDetails from './CompanyDetails'

const SupplierTab = () => {
  const { user } = useAuth()

  return user && Object.values(user).length ? (
    <Grid container spacing={6}>
      <Grid item lg={6} md={6} xs={12}>
        <DetailsOverivew />
        <Box sx={{ mt: 3 }} >
          <GoodsServices supplierEmail={""} />
        </Box>
        <Box sx={{ mt: 3 }} >
          <CompanyDetails />
        </Box>
      </Grid>
      <Grid item lg={6} md={6} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <SupplierPayments />
          </Grid>
          <Grid item xs={12}>
            <SupplierSocial />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : null
}

export default SupplierTab
