// ** React Imports
import { useState } from 'react'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** Types
import { OrderType, OrderClientType } from 'src/types/apps/orderTypes'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AddCard from 'src/layouts/views/order/add/AddCard'
import AddNewCustomer from 'src/layouts/views/order/add/AddNewCustomer'
import connectDB from 'src/lib/connectDB'
import UserModel from 'src/lib/models/User.model'
import OrderModel from 'src/lib/models/Order.model'
import { Role } from 'src/context/types'
import CustomerModel from 'src/lib/models/Customer.model'
import { useSession } from 'next-auth/react'

const OrderAdd = ({ apiClientData, orderNumber }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<OrderClientType | null>(null)
  const [clients, setClients] = useState<OrderClientType[] | undefined>(apiClientData)

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <AddCard
        clients={clients}
        orderNumber={orderNumber}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        toggleAddCustomerDrawer={toggleAddCustomerDrawer}
      />
      <AddNewCustomer
        clients={clients}
        open={addCustomerOpen}
        setClients={setClients}
        toggle={toggleAddCustomerDrawer}
        setSelectedClient={setSelectedClient}
      />
    </DatePickerWrapper>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  await connectDB();
  const customers = await CustomerModel.find({ blocked: '0' })
  const apiClientData: OrderClientType[] = customers.map(customer => {
    const { _id, siteName, accountId, deliveryAddress, phone, email, username, avatarImage } = customer
    
    return {
      customerId: _id.toString() || '',
      siteName: siteName || '',
      accountId: accountId || '',
      deliveryAddress: deliveryAddress || '',
      phone: phone || '',
      name: username || '',
      email: email || '',
      avatarImage: avatarImage || ''
    }
  })

  // Getting orders
  const orders = await OrderModel.find();
  const lastOrderNumber = orders.length > 0 ? Math.max(...orders.map((i: OrderType) => i.id)) : 0

  return {
    props: {
      apiClientData,
      orderNumber: lastOrderNumber + 1
    }
  }
}

OrderAdd.acl = {
  action: 'read',
  subject: 'supplier-orderlist'
}

export default OrderAdd
