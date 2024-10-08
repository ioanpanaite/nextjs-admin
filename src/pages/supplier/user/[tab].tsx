import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import UserProfile from 'src/layouts/views/profile/UserProfile'

const SupplierProfile = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserProfile tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'supplier' } },
      { params: { tab: 'profile' } },
      { params: { tab: 'delivery' } },
      { params: { tab: 'teams' } },
      { params: { tab: 'notifications' } },
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {

  return {
    props: {
      tab: params?.tab
    }
  }
}

SupplierProfile.acl = {
  action: 'manage',
  subject: 'supplierprofile'
}

export default SupplierProfile
