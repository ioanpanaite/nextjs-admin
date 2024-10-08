import { GetStaticProps } from "next/types";
import Preview from "src/layouts/views/order/preview/Preview"
import connectDB from "src/lib/connectDB";
import OrderModel from "src/lib/models/Order.model";

const OrderPreview = ({ id }: { id: number }) => {
  return <Preview id={id} />
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

OrderPreview.acl = {
  action: 'read',
  subject: 'supplier-orderpreview'
}

export default OrderPreview
