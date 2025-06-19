import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSalesPerDayAction } from '../_actions/get-sales-per-day.action'

export function useGetSalesPerDay() {
  const { data, isLoading } = useQuery({
    queryKey: ['sales-per-day'],
    queryFn: async () => {
      const apiResp = await getSalesPerDayAction()

      if ('error' in apiResp) {
        toast.error(apiResp.error)
        return null
      }

      return apiResp
    },
  })

  const salesPerDay =
    data?.map((sale) => ({
      date: new Date(sale.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
      total: sale.total,
    })) || []

  return {
    salesPerDay,
    isLoading,
  }
}
