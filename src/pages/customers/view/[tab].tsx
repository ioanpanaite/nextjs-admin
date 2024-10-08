// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

import UserViewPage from 'src/layouts/views/user/view/UserViewPage'


const UserView = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing-plan' } },
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  // const res = await axios.get('/admin/order/orders')

  return {
    props: {
      tab: params?.tab
    }
  }
}

export default UserView
