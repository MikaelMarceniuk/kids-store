'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/common/components/ui/table'
import { User } from '@/src/common/types/user.type'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useGetUsers, UserWithMissingLetter } from '../_hooks/get-users.hook'
import { UserActions } from './user-actions'
import { UserFilters } from './user-filters'

export const columns: ColumnDef<UserWithMissingLetter>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'missingLetter',
    header: 'Letra Faltante',
    cell: ({ row }) => row.original.missingLetter,
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => <UserActions userId={row.original.id} />,
  },
]

export function UsersTable() {
  const [filters, setFilters] = useState({})
  const { users } = useGetUsers(filters)

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
  })

  return (
    <div className="space-y-4">
      <UserFilters onChange={setFilters} />
      <div className="rounded-md border h-[50vh] overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
