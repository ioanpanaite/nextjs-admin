// ** React Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types';
import SupplierCustomerVeiw from 'src/layouts/views/customers/SupplierCustomerVeiw';
import connectDB from 'src/lib/connectDB';
import CustomerModel from 'src/lib/models/Customer.model';

const CustomerView = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <SupplierCustomerVeiw id={id} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  await connectDB();
  const customer = await CustomerModel.findOne();
  const id = customer ? customer._id.toString() : 0

  return {
    props: {
      id
    }
  }
}

CustomerView.acl = {
  action: 'read',
  subject: 'supplier-customerview'
}

export default CustomerView
