import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  UpdateUserAction,
  UpdateUserActionParams,
} from '../actions/update-user-action'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: async (data: UpdateUserActionParams) => {
      const apiResp =
        (await UpdateUserAction({ ...data })) || ({} as FormattedApiError)

      if ('error' in apiResp) {
        throw new Error(apiResp.error)
      }

      return apiResp
    },
    onSuccess: () => {
      toast.success('Success!', {
        description: 'User updated successfully!',
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
