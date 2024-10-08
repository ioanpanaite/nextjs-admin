// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import PrintPage from 'src/layouts/views/order/print/PrintPage'


const OrderPrint = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <PrintPage id={id} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id
    }
  }
}

OrderPrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

OrderPrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default OrderPrint
