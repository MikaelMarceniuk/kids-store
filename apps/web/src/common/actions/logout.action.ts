import { api } from '../lib/http/axios'
import { handleApiError } from '../lib/http/helpers/handle-api-error.helper'

export async function logoutAction() {
  try {
    await api.post('/auth/logout')
  } catch (err) {
    return handleApiError(err)
  }
}
