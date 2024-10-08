// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Edit from 'src/layouts/views/order/edit/Edit'

const OrderEdit = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={id} />
    </DatePickerWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id
    }
  }
}

OrderEdit.acl = {
  action: 'read',
  subject: 'supplier-orderedit'
}

export default OrderEdit
