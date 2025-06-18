import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'
import { Role } from '@/src/common/types/role.type'
import { User } from '@/src/common/types/user.type'

export interface GetUsersActionParams {
  name?: string
  email?: string
  role?: Role
}

interface GetUsersActionResponse {
  total: number
  users: User[]
}

export async function getUsersAction(
  params: GetUsersActionParams
): Promise<GetUsersActionResponse | FormattedApiError> {
  try {
    const { data } = await api.get<GetUsersActionResponse>('/users', {
      params,
    })
    return data
  } catch (err) {
    return handleApiError(err)
  }
}
