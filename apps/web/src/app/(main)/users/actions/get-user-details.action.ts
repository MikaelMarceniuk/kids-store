import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'
import { User } from '@/src/common/types/user.type'

export interface GetUserDetailsAction {
  userId: string
}

export async function getUserDetailsAction({
  userId,
}: GetUserDetailsAction): Promise<User | FormattedApiError> {
  try {
    const { data } = await api.get<User>(`/users/${userId}`)
    return data
  } catch (err) {
    return handleApiError(err)
  }
}
