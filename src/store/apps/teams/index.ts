// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

// ** Axios Imports
import axios from 'axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface DataParams {
  q: string
}

export interface TeamCustomerType {
  email: string
  name: string
  memberEmail: string
  role: string
  status: string
}

// ** Fetch Teams
export const fetchData = createAsyncThunk('appTeams/fetchData', async (params: DataParams) => {
  const response = await axios.get('/api/profile/teams', {
    params
  })

  return response.data.info
})

export const addMember = createAsyncThunk(
  'appTeams/addMember',
  async (data: TeamCustomerType, { getState, dispatch }: Redux) => {
    const response = await axios.post('/api/profile/teams/add', {
      data
    })
    dispatch(fetchData(getState().teams.params))

    return response.data
  }
)

export const appTeamsSlice = createSlice({
  name: 'appTeams',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.teams
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appTeamsSlice.reducer
