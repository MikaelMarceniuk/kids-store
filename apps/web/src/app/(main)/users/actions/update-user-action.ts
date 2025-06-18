import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

export interface UpdateUserActionParams {
  userId: string
  name: string
  email: string
  role: string
}

export async function UpdateUserAction({
  userId,
  name,
  email,
  role,
}: UpdateUserActionParams): Promise<void | FormattedApiError> {
  try {
    await api.patch(`/users/${userId}`, { name, email, role })
  } catch (err) {
    return handleApiError(err)
  }
}
