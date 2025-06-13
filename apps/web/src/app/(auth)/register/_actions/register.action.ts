import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

export interface RegisterActionParams {
  name: string
  email: string
  password: string
}

export class RegisterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RegisterError'
  }
}

export async function registerAction({
  name,
  email,
  password,
}: RegisterActionParams): Promise<void | FormattedApiError> {
  try {
    await api.post('/auth/register', { name, email, password })
  } catch (err) {
    return handleApiError(err)
  }
}
