'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { createContext, ReactNode } from 'react'
import { toast } from 'sonner'
import { getCurrentUserAction } from '../actions/get-current-user.action'
import { logoutAction } from '../actions/logout.action'
import { User } from '../types/user.type'

interface SessionContextType {
  user: User | null | undefined
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  getUserInitials: () => string
}

export const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const { replace } = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['/me'],
    queryFn: async () => {
      const apiResp = await getCurrentUserAction()

      if ('error' in apiResp) {
        replace('/sign-in')
        toast.warning('Session expired.', {
          description: 'Sign in again to continue.',
        })
        return null
      }

      return apiResp
    },
  })

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await logoutAction()
      toast.warning('Sessão encerrada.', {
        description: 'Você foi deslogado com sucesso.',
      })
      replace('/sign-in')
    },
  })

  const getUserInitials = () => {
    if (!data) return ''

    const parts = data.name.trim().split(' ')
    return `${parts[0][0]}${parts[parts.length - 1][0]}`
  }

  return (
    <SessionContext.Provider
      value={{
        user: data,
        isLoading,
        isAuthenticated: !!data,
        logout,
        getUserInitials,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
