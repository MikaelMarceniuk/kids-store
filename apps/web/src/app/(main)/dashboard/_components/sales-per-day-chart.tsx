'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/common/components/ui/card'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useGetSalesPerDay } from '../_hooks/use-get-sales-per-day.hook'

export function SalesPerDayChart() {
  const { salesPerDay } = useGetSalesPerDay()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales per day</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={salesPerDay}
              margin={{ top: 0, right: 32, left: 32, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />

              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <Tooltip
                formatter={(value: number) =>
                  `R$ ${value.toFixed(2).replace('.', ',')}`
                }
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
