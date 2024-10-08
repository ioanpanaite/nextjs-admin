import { Role, Plan, Status } from "../context/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role | string
      email: string
      image?: string
      fullName: string
      username: string
      currentPlan: Plan | string
      status: Status | string
    }
  }
}