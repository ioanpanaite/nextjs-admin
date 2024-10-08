// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { ContactDataType } from '../product'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface DataParams {
  q: string
  tag: string
  status: string
}

interface DetailParams {
  _id: string
}

interface BlockParams {
  _id: string
  blocked: string
}
export interface CustomerModelType {
  _id: string
  siteName: string
  accountId: string
  deliveryAddress: string
  contact: string
  email: string
  username: string
  supplierEmail: string
  blocked: string
  avatarImage: string
}

// Getting user by id
export const getCustomer = (state: any, id: string | number) => state.allData.find((data: any) => data._id === id)

// ** Fetch Supplier's updateCustomer Details
export const fetchCustomerDetail = createAsyncThunk('appCustomer/fetchCustomerDetail', async (params: DetailParams) => {
  const response = await axios.get('/api/customers/getDetail', { params })
  
  return response.data.customer
})

// ** Fetch Supplier's updateCustomer Details
export const fetchCustomer = createAsyncThunk('appCustomer/fetchCustomer', async (params: DataParams) => {
  const response = await axios.get('/api/customers/get', { params })
  
  return response.data.info
})

// Update supplier's customer info
export const updateCustomer = createAsyncThunk(
  'appCustomer/updateCustomer',
  async (data: CustomerModelType, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/customers/update-customer', {
      data
    })
    dispatch(fetchCustomer(getState().customer.params))

    return response.data
  }
)

// Update supplier's customer info
export const blockCustomer = createAsyncThunk(
  'appCustomer/blockCustomer',
  async (data: BlockParams, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/customers/block-customer', {
      data
    })
    
    return response.data
  }
)

// Delete supplier's account
export const deleteCustomer = createAsyncThunk(
  'appCustomer/deleteCustomer',
  async (data: {_id: string}, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/customers/delete-customer', {
      data
    })
    
    return response.data
  }
)

export const setUpdateResult = createAsyncThunk('appCustomer/setUpdateResult', (params: any) => {
  return {
    status: params.status,
    message: params.message,
  }
})

export const appCustomerSlice = createSlice({
  name: 'appCustomer',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    detail: <CustomerModelType>{},
    updateStatus: '',
    updateMessage: '',
    blockStatus: '',
    blockMessage: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCustomer.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
    builder.addCase(fetchCustomerDetail.fulfilled, (state, action) => {
      state.detail = action.payload
    })
    builder.addCase(setUpdateResult.fulfilled, (state, action) => {
      state.updateStatus = action.payload.status;
      state.updateMessage = action.payload.message;
    })
    builder.addCase(blockCustomer.fulfilled, (state, action) => {
      state.updateStatus = action.payload.status;
      state.updateMessage = action.payload.message;
    })
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.updateStatus = action.payload.status;
      state.updateMessage = action.payload.message;
    })
  }
})

export default appCustomerSlice.reducer
