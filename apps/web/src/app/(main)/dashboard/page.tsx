import { SalesPerDayChart } from './_components/sales-per-day-chart'
import { TopCustomersByAverageSaleChart } from './_components/top-customers-by-average-sale-chart'
import { TopCustomersByPurchaseFrequencyChart } from './_components/top-customers-by-purchase-frequency-chart'
import { TopCustomersByVolumeChart } from './_components/top-customers-by-volume-chart'

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <SalesPerDayChart />
      <div className="flex gap-4">
        <TopCustomersByVolumeChart />
        <TopCustomersByAverageSaleChart />
      </div>

      <TopCustomersByPurchaseFrequencyChart />
    </div>
  )
}
