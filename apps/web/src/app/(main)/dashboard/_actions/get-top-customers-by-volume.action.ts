import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

interface GetTopCustomersByVolumeResponse {
  id: string
  name: string
  amount: number
  price: number
}

export async function getTopCustomersByVolumeAction(): Promise<
  GetTopCustomersByVolumeResponse[] | FormattedApiError
> {
  try {
    const { data } = await api.get<GetTopCustomersByVolumeResponse[]>(
      '/stats/top-customers-by-volume'
    )
    return data
  } catch (error) {
    return handleApiError(error)
  }
}
