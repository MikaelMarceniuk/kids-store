import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getTopCustomersByVolumeAction } from '../_actions/get-top-customers-by-volume.action'

export function useGetTopCustomersByVolume() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-customers-by-volume'],
    queryFn: async () => {
      const apiResp = await getTopCustomersByVolumeAction()

      if ('error' in apiResp) {
        toast.error(apiResp.error)
        return null
      }

      return apiResp
    },
  })

  return {
    topCustomersByVolume: data || [],
    isLoading,
  }
}
