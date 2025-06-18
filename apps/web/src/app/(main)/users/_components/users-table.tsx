'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/src/common/components/ui/form'
import { Input } from '@/src/common/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/common/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/common/components/ui/table'
import { cleanFilters } from '@/src/common/lib/utils'
import { Role } from '@/src/common/types/role.type'
import { User } from '@/src/common/types/user.type'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'
import { useGetUsers } from '../_hooks/get-users.hook'
import { AddUserDialog } from './add-user.dialog'
import { UserActions } from './user-actions'

const schema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
})

type Schema = z.infer<typeof schema>

export const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => <UserActions userId={row.original.id} />,
  },
]

export function UsersTable() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      name: '',
      role: undefined,
    },
  })

  const watchedValues = useWatch({ control: form.control })
  const [debouncedFilters] = useDebounce(watchedValues, 500)

  const { users } = useGetUsers(cleanFilters(debouncedFilters))

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Form {...form}>
          <form className="flex gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(
                          value === 'remove' ? '' : (value as Role)
                        )
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(Role).map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                          >
                            {role.charAt(0).toUpperCase() +
                              role.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                        <SelectItem value="remove">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="self-end">
          <AddUserDialog />
        </div>
      </div>

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
