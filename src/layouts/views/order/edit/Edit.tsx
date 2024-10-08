// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Types
import { SingleOrderType, OrderLayoutProps } from 'src/types/apps/orderTypes'

// ** Third Party Components
import axios from 'axios'

import EditCard from './EditCard'
import SendOrderDrawer from '../shared-drawer/SendOrderDrawer'
import AddPaymentDrawer from '../shared-drawer/AddPaymentDrawer'

const OrderEdit = ({ id }: OrderLayoutProps) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | SingleOrderType>(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
  const [sendOrderOpen, setSendOrderOpen] = useState<boolean>(false)

  const toggleSendOrderDrawer = () => setSendOrderOpen(!sendOrderOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)

  useEffect(() => {
    axios
      .get('/api/admin/order/single', { params: { id } })
      .then(res => {
        const { data } = res.data
        setData(data)
        if (!data.order) {
          setError(true)
        } else {
          setError(false)
        }
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
  }, [id])

  if (data?.order) {
    return (
      <>
        <EditCard data={data} toggleSendOrderDrawer={toggleSendOrderDrawer} toggleAddPaymentDrawer={toggleAddPaymentDrawer} />
        <SendOrderDrawer open={sendOrderOpen} toggle={toggleSendOrderDrawer} />
        <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} />
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Order with the id: {id} does not exist. Please check the list of orders:{' '}
            <Link href='/admin/order/list'>Order List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default OrderEdit
