// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface DataParams {
  search: string
  type: string
}

export interface CustomerType {
  siteName: string
  address: string
  accountId: string
}

export interface ProductDataType {
  code: string
  name: string
  unit: string
  price: string
}

export interface ContactDataType {
  name: string
  phone: string
  email: string
}

export interface ProductModelType {
  customerId: string
  supplierEmail: string
  orderId: string
  code: string
  name: string
  image: string
  unit: string
  quantity: string
  price: string
}

interface CustomerProduct {
  supplierEmail: string
  customerData: CustomerType | null
  productData: ProductDataType
}

interface ContactDetailsType {
  supplierEmail?: string
  customerId?: string
  contactData: ContactDataType
}

// ** Fetch product details
export const fetchAllProducts = createAsyncThunk('appProduct/fetchAllProducts', async () => {
  const response = await axios.get('/api/customers/product/getAll')
  
  return response.data.info
})

export const fetchProducts = createAsyncThunk('appProduct/fetchProducts', async (params: DataParams) => {
  const response = await axios.get('/api/customers/product/get', { params })
  
  return response.data.info
})

export const updateProduct = createAsyncThunk(
  'appProduct/updateProduct',
  async (data: CustomerProduct, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/customers/product/update', {
      data
    })
    dispatch(fetchProducts({ search: response.data.info.id, type: 'id' }))

    return response.data
  }
)

export const updateContactDetails = createAsyncThunk(
  'appProduct/updateContactDetails',
  async (data: ContactDetailsType, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/customers/product/update-contact', {
      data
    })
    dispatch(fetchAllProducts())

    return response.data
  }
)

export const appProductSlice = createSlice({
  name: 'appProduct',
  initialState: {
    data: [],
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.allData = action.payload.data
    })
  }
})

export default appProductSlice.reducer
