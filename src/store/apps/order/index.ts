// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { OrderProduct } from 'src/types/apps/orderTypes'

interface DataParams {
  q: string
  dates?: Date[]
  status: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Orders
export const fetchData = createAsyncThunk('appOrder/fetchData', async (params: DataParams) => {
  const response = await axios.get('/api/admin/order/list', {
    params
  })

  return response.data.data
})

// ** Add Order
export const addOrder = createAsyncThunk(
  'appOrder/addOrder',
  async (data: { [key: string]: number | string | Array<OrderProduct> }, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/admin/order/add', {
      data
    })
    dispatch(fetchData(getState().order.params))

    return response.data
  }
)

// Update order info
export const updateOrder = createAsyncThunk(
  'appOrder/updateOrder',
  async (data: { [key: string]: number | string | Array<OrderProduct> }, { getState, dispatch }: Redux) => {
    const response = await axios.put('/api/admin/order/update', {
      data
    })

    return response.data
  }
)

export const refundOrder = createAsyncThunk(
  'appOrder/refundData',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/admin/order/refund`, { data })
    dispatch(fetchData(getState().order.params))

    return response.data
  }
)

export const deleteOrder = createAsyncThunk(
  'appOrder/deleteData',
  async (id: number, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`/api/admin/order/delete/${id}`)
    dispatch(fetchData(getState().order.params))

    return response.data
  }
)

export const appOrderSlice = createSlice({
  name: 'appOrder',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.orders
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appOrderSlice.reducer
