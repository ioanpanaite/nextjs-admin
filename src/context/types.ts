export enum Plan {
  Free = 'free',
  Basic = 'basic',
  Company = 'company',
  Enterprise = 'enterprise',
  Team = 'team'
}

export enum Role {
  Admin = 'admin',
  Buyer = 'buyer',
  Supplier = 'supplier'
}

export enum Status {
  Active = 'active',
  Pending = 'pending',
  Inactive = 'inactive',
  Refunded = 'refunded'
}

export enum TeamRole {
  Admin = 'admin',
  Processor = 'processor',
  Representative = 'Representative',
  Driver = 'driver'
}

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: string
  role: Role | string
  email: string
  fullName: string
  username: string
  password?: string
  image?: string
  cover?: string
  currentPlan: Plan | string
  status: Status | string
  businessName?: string
  businessDesc?: string
  businessAddress?: string
  businessPhone?: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
