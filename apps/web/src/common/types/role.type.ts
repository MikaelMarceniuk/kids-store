export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const

export type Role = keyof typeof Role
