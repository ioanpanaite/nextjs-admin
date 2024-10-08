// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface SocialMedia {
  instagram: string
  linkedin: string
  twitter: string
}

// ** Fetch Supplier's Social data
export const fetchSocial = createAsyncThunk('appSupplier/fetchSocial', async () => {
  const response = await axios.get('/api/profile/supplier/social')
  
  return response.data.info
})

// Update supplier's social media
export const updateSocial = createAsyncThunk(
  'appSupplier/updateSocial',
  async (data: SocialMedia, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/profile/supplier/update-social', {
      data
    })
    dispatch(fetchSocial())

    return response.data
  }
)

export const appSocialSlice = createSlice({
  name: 'appSupplier',
  initialState: {
    data: {
      instagram: '',
      linkedin: '',
      twitter: ''
    },
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSocial.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
  }
})

export default appSocialSlice.reducer
