import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getUsersAction,
  GetUsersActionParams,
} from '../actions/get-users.action'

export function useGetUsers(filters: GetUsersActionParams) {
  const { data, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const apiResp = await getUsersAction(filters)

      if ('error' in apiResp) {
        toast.warning('Error in getting users.')
        return null
      }

      return apiResp
    },
  })

  return {
    users: data?.users || [],
    isLoading,
    total: data?.total || 0,
  }
}
