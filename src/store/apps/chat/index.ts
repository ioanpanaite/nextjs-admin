// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { Dispatch } from 'redux'
import { SendMsgParamsType } from 'src/types/apps/chatTypes'

// ** Fetch Chats & Contacts
export const fetchChatsContacts = createAsyncThunk('appChat/fetchChatsContacts', async () => {
  const response = await axios.get('/api/chat/chats-and-contacts')

  return response.data.result
})

// ** Select Chat
export const selectChat = createAsyncThunk(
  'appChat/selectChat',
  async (id: number | string, { dispatch }: { dispatch: Dispatch<any> }) => {
    const response = await axios.get('/api/chat/get-chat', {
      params: {
        id
      }
    })
    await dispatch(fetchChatsContacts())

    return response.data.result
  }
)

// ** Send Msg
export const sendMsg = createAsyncThunk('appChat/sendMsg', async (obj: SendMsgParamsType, { dispatch }) => {
  const response = await axios.post('/api/chat/send-msg', {
    data: {
      obj
    }
  })
  if (obj) {
    await dispatch(selectChat(obj.id))
  }
  
  // await dispatch(fetchChatsContacts())

  return response.data.result
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: null,
    contacts: null,
    selectedChat: null
  },
  reducers: {
    removeSelectedChat: state => {
      state.selectedChat = null
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchChatsContacts.fulfilled, (state, action) => {
      state.contacts = action.payload.contacts
      state.chats = action.payload.chatsContacts
    })
    builder.addCase(selectChat.fulfilled, (state, action) => {
      state.selectedChat = action.payload
    })
  }
})

export const { removeSelectedChat } = appChatSlice.actions

export default appChatSlice.reducer
