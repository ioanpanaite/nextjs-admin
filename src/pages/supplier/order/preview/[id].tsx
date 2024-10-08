// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

import Preview from 'src/layouts/views/order/preview/Preview'

const OrderPreview = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Preview id={id} />
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

OrderPreview.acl = {
  action: 'read',
  subject: 'supplier-orderpreview'
}

export default OrderPreview
