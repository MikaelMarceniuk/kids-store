import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  deleteUserAction,
  DeleteUserActionParams,
} from '../actions/delete-user.action'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: async (data: DeleteUserActionParams) => {
      const apiResp =
        (await deleteUserAction({ ...data })) || ({} as FormattedApiError)

      if ('error' in apiResp) {
        throw new Error(apiResp.error)
      }

      return apiResp
    },
    onSuccess: () => {
      toast.success('Success!', {
        description: 'User deleted successfully!',
      })

      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message,
      })
    },
  })

  return {
    mutate,
  }
}
