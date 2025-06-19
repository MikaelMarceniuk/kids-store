import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GetTopCustomersByPurchaseFrequencyAction } from '../_actions/get-top-customers-by-purchase-frequency.action'

export function useGetTopCustomersByPurchaseFrequency() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-customers-by-purchase-frequency'],
    queryFn: async () => {
      const apiResp = await GetTopCustomersByPurchaseFrequencyAction()

      if ('error' in apiResp) {
        toast.error(apiResp.error)
        return null
      }

      return apiResp
    },
  })

  return {
    topCostumersByPurchaseFrequency: data || [],
    isLoading,
  }
}
