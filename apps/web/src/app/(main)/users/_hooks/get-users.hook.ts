import { firstMissingLetter } from '@/src/common/lib/utils'
import { User } from '@/src/common/types/user.type'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getUsersAction,
  GetUsersActionParams,
} from '../actions/get-users.action'

export interface UserWithMissingLetter extends User {
  missingLetter?: string
}

export function useGetUsers(filters: GetUsersActionParams) {
  const { data, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const apiResp = await getUsersAction(filters)

      if ('error' in apiResp) {
        toast.error(apiResp.error)
        return null
      }

      return apiResp
    },
  })

  const users: UserWithMissingLetter[] =
    data?.users.map((user: User) => ({
      ...user,
      missingLetter: firstMissingLetter(user.name),
    })) || []

  return {
    users,
    isLoading,
    total: data?.total || 0,
  }
}
