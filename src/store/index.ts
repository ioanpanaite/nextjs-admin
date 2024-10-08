// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/apps/user'
import order from 'src/store/apps/order'
import chat from 'src/store/apps/chat'
import content from 'src/store/apps/content'
import teams from 'src/store/apps/teams'
import catalogue from 'src/store/apps/catalogue'
import promotion from 'src/store/apps/promotion'
import social from 'src/store/apps/social'
import company from './apps/company'
import customer from './apps/customer'
import product from './apps/product'
import customerOrders from './apps/customer/orders'


export const store = configureStore({
  reducer: {
    user,
    order,
    chat,
    content,
    teams,
    catalogue,
    promotion,
    social,
    company,
    customer,
    product,
    customerOrders,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
