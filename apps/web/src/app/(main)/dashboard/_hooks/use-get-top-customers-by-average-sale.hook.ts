import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getTopCustomersByAverageSaleAction } from '../_actions/get-top-customers-by-average-sale.action'

export function useGetTopCustomersByAverageSale() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-customers-by-average-sale'],
    queryFn: async () => {
      const apiResp = await getTopCustomersByAverageSaleAction()

      if ('error' in apiResp) {
        toast.error(apiResp.error)
        return null
      }

      return apiResp
    },
  })

  return {
    topCustomersByAverageSale: data || [],
    isLoading,
  }
}
