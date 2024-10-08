// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { ContactDataType } from '../product'

interface OrderDataParams {
  dates: Date[]
  q: string
  status: string
  id: string
}

export interface CustomerModelType {
  supplierEmail: string
  siteName: string
  deliveryAddress: string
  accountId: string
  contactDetails: ContactDataType
}

export const fetchOrders = createAsyncThunk('appOrder/fetchOrders', async (params: OrderDataParams) => {
  const response = await axios.get('/api/customers/orders/list', {
    params
  })

  return response.data.data
})

export const appCustomerOrderSlice = createSlice({
  name: 'appCustomerOrder',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appCustomerOrderSlice.reducer
