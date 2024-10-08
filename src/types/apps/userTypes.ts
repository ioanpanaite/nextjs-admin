// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export interface SnackbarMessage {
  key: string
  message: string
}

export type UsersType = {
  id: string
  role: string
  email: string
  status: string
  password?: string
  avatar: string
  company: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
}

export type ProjectListDataType = {
  id: string
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
