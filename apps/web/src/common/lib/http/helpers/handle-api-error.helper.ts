import { AxiosError } from 'axios'
import { ApiError } from '../types/api-error.type'
import { FormattedApiError } from '../types/formated-api-error.type'

export type ApiReturn<T, X = undefined> = T | FormattedApiError<X>

export function handleApiError<X = undefined>(
  error: unknown
): FormattedApiError<X> {
  if (error instanceof AxiosError && error.response) {
    const errorResponse = error.response.data as ApiError

    return {
      statusCode: error.response.status,
      error: errorResponse.errors
        ? errorResponse.errors.join(', ')
        : errorResponse.message,
      custom: errorResponse.custom,
    }
  }

  return { statusCode: 500, error: 'Unexpected error' }
}
