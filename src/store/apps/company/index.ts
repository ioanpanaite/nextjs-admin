// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface CompanyDetailsType {
  foundedIn: string
  basedIn: string
  shipsFrom: string
  productMadeIn: string
  leadTime: string
  minOrder: string
  values: string
  productCover: string
  productTitle: string
  productText: string
}

// ** Fetch Supplier's Company Details
export const fetchCompany = createAsyncThunk('appCompany/fetchCompany', async () => {
  const response = await axios.get('/api/profile/supplier/get-company')
  
  return response.data.info
})

// Update supplier's social media
export const updateCompany = createAsyncThunk(
  'appCompany/updateCompany',
  async (data: CompanyDetailsType, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/profile/supplier/update-company', {
      data
    })
    dispatch(fetchCompany())

    return response.data
  }
)

export const appCompanySlice = createSlice({
  name: 'appCompany',
  initialState: {
    data: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCompany.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
  }
})

export default appCompanySlice.reducer
