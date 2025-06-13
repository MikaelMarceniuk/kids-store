import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

export interface AuthenticateActionProps {
  email: string
  password: string
}

export async function AuthenticateAction({
  email,
  password,
}: AuthenticateActionProps): Promise<void | FormattedApiError> {
  try {
    await api.post('/auth', { email, password })
  } catch (err) {
    return handleApiError(err)
  }
}
