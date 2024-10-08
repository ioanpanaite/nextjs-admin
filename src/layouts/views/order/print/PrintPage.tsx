// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'

// ** Types
import { SingleOrderType, OrderLayoutProps, OrderProduct } from 'src/types/apps/orderTypes'

// ** Third Party Components
import axios from 'axios'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const OrderPrint = ({ id }: OrderLayoutProps) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | SingleOrderType>(null)

  // ** Hooks
  const theme = useTheme()

  useEffect(() => {
    setTimeout(() => {
      window.print()
    }, 500)
  }, [])

  useEffect(() => {
    axios
      .get('/api/admin/order/single', { params: { id } })
      .then(res => {
        const { data } = res.data
        setData(data)
        setError(false)
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
  }, [id])

  if (data) {
    const { order } = data

    return (
      <Box sx={{ p: 12, pb: 6 }}>
        <Grid container>
          <Grid item xs={8} sx={{ mb: { sm: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    fill={theme.palette.primary.main}
                    d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                  />
                  <path
                    fill='#161616'
                    opacity={0.06}
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                  />
                  <path
                    fill='#161616'
                    opacity={0.06}
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    fill={theme.palette.primary.main}
                    d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                  />
                </svg>
                <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <div>
                <Typography sx={{ mb: 1, color: 'text.secondary' }}>Office 149, 450 South Brand Brooklyn</Typography>
                <Typography sx={{ mb: 1, color: 'text.secondary' }}>San Diego County, CA 91905, USA</Typography>
                <Typography sx={{ color: 'text.secondary' }}>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end', xs: 'flex-start' } }}>
              <Typography variant='h4' sx={{ mb: 2 }}>
                {`Order #${order.id}`}
              </Typography>
              <Box sx={{ mb: 2, display: 'flex' }}>
                <Typography sx={{ mr: 3, color: 'text.secondary' }}>Date Issued:</Typography>
                <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{order.issuedDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ mr: 3, color: 'text.secondary' }}>Date Due:</Typography>
                <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{order.dueDate}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: theme => `${theme.spacing(6)} !important` }} />

        <Grid container>
          <Grid item xs={7} md={8} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='h6' sx={{ mb: 3.5, fontWeight: 600 }}>
              Order To:
            </Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{order.name}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{order.siteName}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{order.deliveryAddress}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{order.phone}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{order.email}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: '0 !important' }} />

        <Table sx={{ mb: 6 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>qty</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& .MuiTableCell-root': {
                py: `${theme.spacing(2.5)} !important`,
                fontSize: theme.typography.body1.fontSize
              }
            }}
          >
            {
              order.product.map((product: OrderProduct) => (
                <TableRow key={product.title}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>£{product.price}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>

        <Grid container>
          <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
          </Grid>
          <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography sx={{ color: 'text.secondary' }}>Subtotal:</Typography>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>£{data.order.subTotal}</Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography sx={{ color: 'text.secondary' }}>Discount:</Typography>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{data.order.discount}%</Typography>
            </CalcWrapper>
            <CalcWrapper sx={{ mb: '0 !important' }}>
              <Typography sx={{ color: 'text.secondary' }}>Tax:</Typography>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{data.order.tax}%</Typography>
            </CalcWrapper>
            <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
            <CalcWrapper>
              <Typography sx={{ color: 'text.secondary' }}>Total:</Typography>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>£{data.order.total}</Typography>
            </CalcWrapper>
          </Grid>
        </Grid>

        <Divider sx={{ my: `${theme.spacing(6)} !important` }} />
        <Typography sx={{ color: 'text.secondary' }}>
          <strong>Note:</strong> {data.order.orderNote}
        </Typography>
      </Box>
    )
  } else if (error) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Order with the id: {id} does not exist. Please check the list of orders:{' '}
              <Link href='/admin/order/list'>Order List</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  } else {
    return null
  }
}

export default OrderPrint
