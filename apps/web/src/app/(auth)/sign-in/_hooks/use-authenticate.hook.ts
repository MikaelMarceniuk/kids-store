import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AuthenticateAction,
  AuthenticateActionProps,
} from '../_actions/authenticate.action'

export function useAuthenticate() {
  const { replace } = useRouter()

  const { mutate } = useMutation({
    mutationFn: async (data: AuthenticateActionProps) => {
      const apiResp =
        (await AuthenticateAction({ ...data })) || ({} as FormattedApiError)

      if ('error' in apiResp) {
        throw new Error(apiResp.error)
      }

      return apiResp
    },
    onSuccess: () => replace('/'),
    onError: (error) => {
      toast.error('Error', { description: error.message })
    },
  })

  return {
    authenticate: mutate,
  }
}
