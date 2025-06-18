import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  CreateUserAction,
  CreateUserActionParams,
} from '../actions/create-user-action'

export function useCreateUser() {
  const { mutate } = useMutation({
    mutationFn: async (data: CreateUserActionParams) => {
      const apiResp =
        (await CreateUserAction({ ...data })) || ({} as FormattedApiError)

      if ('error' in apiResp) {
        throw new Error(apiResp.error)
      }

      return apiResp
    },
    onSuccess: () => {
      toast.success('Success!', {
        description: 'User created successfully!',
      })
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
