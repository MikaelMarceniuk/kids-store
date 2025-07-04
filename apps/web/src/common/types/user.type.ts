import { Role } from './role.type'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}
