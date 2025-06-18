import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

export interface CreateUserActionParams {
  name: string
  email: string
  password: string
  role: string
}

export async function CreateUserAction({
  name,
  email,
  password,
  role,
}: CreateUserActionParams): Promise<void | FormattedApiError> {
  try {
    await api.post('/users', { name, email, password, role })
  } catch (err) {
    return handleApiError(err)
  }
}
