import { api } from '@/src/common/lib/http/axios'
import { handleApiError } from '@/src/common/lib/http/helpers/handle-api-error.helper'
import { FormattedApiError } from '@/src/common/lib/http/types/formated-api-error.type'

interface GetSalesPerDayResponse {
  date: string
  total: number
}

export async function getSalesPerDayAction(): Promise<
  GetSalesPerDayResponse[] | FormattedApiError
> {
  try {
    const { data } = await api.get<GetSalesPerDayResponse[]>(
      '/stats/sales-per-day'
    )
    return data
  } catch (error) {
    return handleApiError(error)
  }
}
