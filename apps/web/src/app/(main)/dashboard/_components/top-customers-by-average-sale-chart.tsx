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
import { useGetTopCustomersByAverageSale } from '../_hooks/use-get-top-customers-by-average-sale.hook'

export function TopCustomersByAverageSaleChart() {
  const { topCustomersByAverageSale } = useGetTopCustomersByAverageSale()

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>Top clientes por média de venda</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 pt-4 pb-0 flex">
        <div className="w-full h-[250px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              layout="vertical"
              data={topCustomersByAverageSale}
              margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => `R$ ${v.toFixed(0)}`}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
              />
              <Tooltip
                formatter={(value: number) =>
                  `R$ ${value.toFixed(2).replace('.', ',')}`
                }
              />
              <Bar
                dataKey="averagePrice"
                fill="#f59e0b"
              >
                {topCustomersByAverageSale.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={index === 0 ? '#ea580c' : '#f59e0b'}
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
