// ** React Imports
import { ChangeEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateUser } from 'src/store/apps/user'
import { Box, Snackbar, Typography } from '@mui/material'
import { SnackbarMessage } from 'src/types/apps/userTypes'
import { useAuth } from 'src/hooks/useAuth'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const SupplierPayments = () => {
  // ** States
  const { user } = useAuth()

  const dispatch = useDispatch<AppDispatch>()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Payments' />
          <CardContent>
            <Grid item xs={12}>
              <Box sx={{
                background: theme =>
                  `linear-gradient(72.47deg, ${theme.palette.grey[300]} 22.16%, ${hexToRGBA(
                    theme.palette.grey[300],
                    0.7
                  )} 76.47%)`,
                borderRadius: '10px',
                p: 4
              }}>
                <Typography variant='body1' sx={{}}>
                  connect with Stripe to receive payments
                </Typography>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled' }}>
                  Stripe is a secure third party that stores payment details and manages payments
                </Typography>
                <Button variant='contained'>
                  <Icon icon={'tabler:credit-card-pay'} fontSize='1.625rem' />
                  <Typography sx={{ ml: 2, color: 'white' }}>
                    Connect with Stripe
                  </Typography>
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ my: 4, color: 'text.disabled' }}>
                only you have access to payment details stored in your Stripe account
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{
                background: theme =>
                  `linear-gradient(72.47deg, ${theme.palette.grey[300]} 22.16%, ${hexToRGBA(
                    theme.palette.grey[300],
                    0.7
                  )} 76.47%)`,
                borderRadius: '10px',
                p: 4
              }}>
                <Typography variant='body1' sx={{}}>
                  set up Direct Debit
                </Typography>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled' }}>
                  you need to set up Direct Debit to pay NOM invoices
                </Typography>
                <Button variant='contained'>
                  <Icon icon={'tabler:credit-card-pay'} fontSize='1.625rem' />
                  <Typography sx={{ ml: 2, color: 'white' }}>
                    Set up Direct Debit
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SupplierPayments
