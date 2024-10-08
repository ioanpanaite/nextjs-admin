// ** React Imports
import { GetStaticProps } from 'next/types'
import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import PrintPage from 'src/layouts/views/order/print/PrintPage'
import connectDB from 'src/lib/connectDB'
import OrderModel from 'src/lib/models/Order.model'

const OrderPrint = ({ id }: { id: number }) => {
  return <PrintPage id={id} />
}

OrderPrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

OrderPrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export const getStaticProps: GetStaticProps = async () => {
  await connectDB();
  const order = await OrderModel.findOne();
  const id = order ? order.id : 0

  return {
    props: {
      id
    }
  }
}

export default OrderPrint
