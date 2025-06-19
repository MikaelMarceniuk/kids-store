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
import { useGetTopCustomersByVolume } from '../_hooks/use-get-top-customers-by-volume.hook'

export function TopCustomersByVolumeChart() {
  const { topCustomersByVolume } = useGetTopCustomersByVolume()

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>Top clientes por volume (R$)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 pt-4 pb-0 flex">
        <div className="w-full h-[250px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              layout="vertical"
              data={topCustomersByVolume}
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
                formatter={(value: number, name, props) => {
                  // value é o preço aqui
                  const { payload } = props
                  return [
                    `R$ ${value.toFixed(2).replace('.', ',')}`,
                    'Total vendido',
                    `Qtd: ${payload.amount}`,
                  ]
                }}
              />
              <Bar
                dataKey="price"
                fill="#3B82F6"
              >
                {topCustomersByVolume.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fillOpacity={1 - index * 0.07}
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
