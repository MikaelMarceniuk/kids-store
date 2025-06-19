import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

interface GetTopCustomersByAverageSaleResponse {
  id: string
  name: string
  averagePrice: number
}

export async function getTopCustomersByAverageSaleAction(): Promise<
  GetTopCustomersByAverageSaleResponse[] | FormattedApiError
> {
  try {
    const { data } = await api.get<GetTopCustomersByAverageSaleResponse[]>(
      '/stats/top-customers-by-average-sale'
    )
    return data
  } catch (error) {
    return handleApiError(error)
  }
}
