import { api } from '../lib/http/axios'
import { handleApiError } from '../lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '../lib/http/types/formated-api-error.type'
import { User } from '../types/user.type'

export async function getCurrentUserAction(): Promise<
  User | FormattedApiError
> {
  try {
    const { data } = await api.get<User>('/users/me')
    return data
  } catch (err) {
    return handleApiError(err)
  }
}
