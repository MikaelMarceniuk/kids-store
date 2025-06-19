'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/common/components/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useGetTopCustomersByPurchaseFrequency } from '../_hooks/use-get-top-customers-by-purchase-frequency.hook'

export function TopCustomersByPurchaseFrequencyChart() {
  const { topCostumersByPurchaseFrequency } =
    useGetTopCustomersByPurchaseFrequency()

  console.log(
    'topCostumersByPurchaseFrequency',
    topCostumersByPurchaseFrequency
  )

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>Top clientes por frequência de compra</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 pt-4 pb-0 flex">
        <div className="w-full h-[350px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              layout="vertical"
              data={topCostumersByPurchaseFrequency}
              margin={{ top: 0, right: 32, left: 32, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => `${v} dia${v !== 1 ? 's' : ''}`}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
              />
              <Tooltip
                formatter={(value: number) =>
                  `${value} dia${value !== 1 ? 's' : ''}`
                }
              />
              <Bar
                dataKey="uniqueDays"
                fill="#10b981"
              >
                {topCostumersByPurchaseFrequency.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={index === 0 ? '#059669' : '#10b981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
