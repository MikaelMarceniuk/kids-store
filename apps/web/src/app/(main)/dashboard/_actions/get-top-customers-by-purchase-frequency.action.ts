import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

interface GetTopCustomersByPurchaseFrequencyResponse {
  id: string
  name: string
  uniqueDays: number
}

export async function GetTopCustomersByPurchaseFrequencyAction(): Promise<
  GetTopCustomersByPurchaseFrequencyResponse[] | FormattedApiError
> {
  try {
    const { data } = await api.get<
      GetTopCustomersByPurchaseFrequencyResponse[]
    >('/stats/top-customers-by-purchase-frequency')
    return data
  } catch (error) {
    return handleApiError(error)
  }
}
