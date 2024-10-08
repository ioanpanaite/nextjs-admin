// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

const navigation = (): VerticalNavItemsType => {
  const { user } = useAuth()

  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'tabler:smart-home',
      subject: 'dashboard-page',
    },
    {
      title: 'Users',
      icon: 'tabler:users',
      children: [
        {
          title: 'List',
          path: '/user/list'
        },
        {
          title: 'View',
          children: [
            {
              title: 'Account',
              path: '/user/view/account'
            },
            {
              title: 'Security',
              path: '/user/view/security'
            },
            {
              title: 'Billing & Plans',
              path: '/user/view/billing-plan'
            },
          ]
        }
      ]
    },
    {
      title: 'Orders',
      icon: 'tabler:align-box-bottom-left',
      children: [
        {
          title: 'List',
          path: `/${user?.role}/order/list`,
          subject: `${user?.role}-orderlist`,
        },
        {
          title: 'Preview',
          path: `/${user?.role}/order/preview`,
          subject: `${user?.role}-orderpreview`,
        },
        {
          title: 'Edit',
          path: `/${user?.role}/order/edit`,
          subject: `${user?.role}-orderedit`,
        },
        {
          title: 'Add',
          path: `/${user?.role}/order/add`
        }
      ]
    },
    {
      title: 'Customers',
      icon: 'tabler:users',
      children: [
        {
          title: 'List',
          path: `/${user?.role}/customers/list`,
          subject: `${user?.role}-customers`,
        },
        {
          title: 'View',
          path: `/${user?.role}/customers/view`,
          subject: `${user?.role}-customerview`,
        }
      ]
    },
    {
      title: 'Deliveries',
      icon: 'tabler:truck-delivery',
      children: [
        {
          title: 'List',
          path: `/${user?.role}/deliveries/list`,
          subject: `${user?.role}-deliveries`,
        },
      ]
    },
    {
      title: 'Content',
      path: '/admin/content',
      icon: 'tabler:vocabulary',
    },
    {
      title: 'Catalogue',
      path: `/${user?.role}/catalogue`,
      icon: 'tabler:books',
      subject: 'catalogue-page',
    },
    {
      title: 'Price & Promotions',
      path: `/${user?.role}/promotions`,
      icon: 'solar:tag-price-linear',
      subject: `${user?.role}-promotions`,
    },
    {
      title: 'Chat',
      path: '/conversations',
      icon: 'tabler:messages',
      subject: 'AppChat-page',
    },
  ]
}

export default navigation
