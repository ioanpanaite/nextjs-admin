// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { Dispatch } from 'redux'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface GlobalContent {
  siteTitle: string,
  siteDesc: string
}

interface Item {
  key: string,
  content: string
}

interface HomeContent {
  heroTitle: string,
  items: Array<Item>
}


// ** Fetch content
export const fetchData = createAsyncThunk('appContent/fetchData', async () => {
  const response = await axios.get('/api/admin/content/list')
  
  return response.data.result
})

// Update user info
export const updateContent = createAsyncThunk(
  'appContent/updateContent',
  async (data: { [key: string]: number | string | GlobalContent | HomeContent }, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/admin/content/update', {
      data
    })

    return response.data.result
  }
)

export const appContentSlice = createSlice({
  name: 'appContent',
  initialState: {
    allData: [],
    globalContent: {},
    homeContent: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.allData = action.payload.allData
      state.globalContent = action.payload.globalContent
      state.homeContent = action.payload.homeContent
    })
  }
})

export default appContentSlice.reducer
