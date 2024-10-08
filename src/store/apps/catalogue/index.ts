// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface CatalogueType {
  id: string
  product_code: string
  product_name: string
  description: string
  product_size_per_unit: string
  unit_price_delivery: string
  unit_price_collection: string
  rrp: string
  price_per_unit_measure: string
  quantity: string
  supplier_sku: string
  manufacturer: string
  visible: boolean
  order_unit: string
  unit_measure: string
  ingredients: string
  nutritional_value: string
  variants: string
  min_order_per_product_type: string
  category: string
  sub_category: string
  keyword: string
  minimum_order_quantity: string
  diet: string
  shelf_life: string
  brand_supplier_values: string
  storage: string
  production: string
  allergen: string
  ship_window: string
  lead_time: string
  promotion: string
  product_origin: string
  product_image: string
  on_sale: boolean
  unlimited_stock: boolean
}

// ** Fetch Invoices
export const fetchData = createAsyncThunk('appCatalogue/fetchData', async (params: DataParams) => {
  const response = await axios.get('/api/catalogue/list', { params })
  
  // console.log("11111111111111", response);

  return response.data.result
})

export const addCatalogue = createAsyncThunk(
  'appCatalogue/add',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/catalogue/add', { data })
    dispatch(fetchData(getState().catalogue.params))

    return response.data
  }
)

// To add product manually
export const addProduct = createAsyncThunk(
  'appCatalogue/addProduct',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/catalogue/add-product', { data })
    dispatch(fetchData(getState().catalogue.params))

    return response.data
  }
)

// Update or delete bulk catalogues
export const bulkCatalogue = createAsyncThunk(
  'appCatalogue/bulkCatalogue',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/catalogue/bulk', { data })
    dispatch(fetchData(getState().catalogue.params))

    return response.data
  }
)

export const updateCatalogue = createAsyncThunk(
  'appCatalogue/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/catalogue/update', { data })
    dispatch(fetchData(getState().catalogue.params))

    return response.data
  }
)

export const deleteCatalogue = createAsyncThunk(
  'appCatalogue/delete',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/catalogue/delete', { data })
    dispatch(fetchData(getState().catalogue.params))

    return response.data
  }
)

export const appCatalogueSlice = createSlice({
  name: 'appCatalogue',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    catalogueDetailOpen: false
  },
  reducers: {
    setCatalogueDetailOpen: state => {
      state.catalogueDetailOpen = !state.catalogueDetailOpen
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export const { setCatalogueDetailOpen } = appCatalogueSlice.actions

export default appCatalogueSlice.reducer
