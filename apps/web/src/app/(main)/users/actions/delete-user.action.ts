import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'

export interface DeleteUserActionParams {
  userId: string
}

export async function deleteUserAction({ userId }: DeleteUserActionParams) {
  try {
    await api.delete(`/users/${userId}`)
  } catch (err) {
    return handleApiError(err)
  }
}
