import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getUserDetailsAction } from '../actions/get-user-details.action'

interface useGetUserDetailsProps {
  userId: string
  isEnabled?: boolean
}

export function useGetUserDetails({
  userId,
  isEnabled,
}: useGetUserDetailsProps) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const apiResp = await getUserDetailsAction({ userId })

      if ('error' in apiResp) {
        toast.warning('Error in getting user.')
        return null
      }

      return apiResp
    },
    enabled: isEnabled,
  })

  return {
    user: data,
    isLoading,
    isSuccess,
  }
}
