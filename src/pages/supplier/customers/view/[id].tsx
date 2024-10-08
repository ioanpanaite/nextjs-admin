// ** React Imports
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';
import SupplierCustomerVeiw from 'src/layouts/views/customers/SupplierCustomerVeiw';

const CustomerView = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <SupplierCustomerVeiw id={id} />
    </>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id
    }
  }
}

CustomerView.acl = {
  action: 'read',
  subject: 'supplier-customerview'
}

export default CustomerView
