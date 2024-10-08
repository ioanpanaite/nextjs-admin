// ** Styled Component
import { GetStaticProps } from 'next/types'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Edit from 'src/layouts/views/order/edit/Edit'
import connectDB from 'src/lib/connectDB'
import OrderModel from 'src/lib/models/Order.model'

const OrderEdit = ({ id }: { id: number }) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={id} />
    </DatePickerWrapper>
  )
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

OrderEdit.acl = {
  action: 'read',
  subject: 'orderedit-page'
}

export default OrderEdit
