import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  registerAction,
  RegisterActionParams,
} from '../_actions/register.action'

export function useRegister() {
  const { push } = useRouter()

  const { mutate } = useMutation({
    mutationFn: async (data: RegisterActionParams) => {
      const apiResp =
        (await registerAction({ ...data })) || ({} as FormattedApiError)

      if ('error' in apiResp) {
        throw new Error(apiResp.error)
      }

      return apiResp
    },
    onSuccess: (_d, { email }) => {
      toast.success('Success!', {
        description: 'Account created successfully!',
      })

      push(`/sign-in?email=${encodeURIComponent(email)}`)
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message,
      })
    },
  })

  return {
    register: mutate,
  }
}
