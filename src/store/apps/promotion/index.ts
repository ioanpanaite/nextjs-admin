// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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

// ** Fetch Invoices
export const fetchData = createAsyncThunk('appPromotion/fetchData', async (params: DataParams) => {
  const response = await axios.get('/api/promotion/list', {
    params
  })

  return response.data.result
})

export const addPromotion = createAsyncThunk('appPromotion/add', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post('/api/promotion/add', { data })
  dispatch(fetchData(getState().promotion.params))
  
  return response.data
})

export const updatePromotion = createAsyncThunk('appPromotion/update', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post('/api/promotion/update', { data })
  dispatch(fetchData(getState().promotion.params))
  
  return response.data
})

export const deletePromotion = createAsyncThunk('appPromotion/delete', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post('/api/promotion/delete', { data })
  dispatch(fetchData(getState().promotion.params))
  
  return response.data
})

export const appPromotionSlice = createSlice({
  name: 'appPromotion',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appPromotionSlice.reducer
