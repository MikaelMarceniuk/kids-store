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
import { cleanFilters } from '@/src/common/lib/utils'
import { Role } from '@/src/common/types/role.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'
import { AddUserDialog } from './add-user.dialog'

const schema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
})

export type UserFiltersSchema = z.infer<typeof schema>

type UserFiltersProps = {
  onChange: (filters: UserFiltersSchema) => void
}

export function UserFilters({ onChange }: UserFiltersProps) {
  const form = useForm<UserFiltersSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      name: '',
      role: undefined,
    },
  })

  const watched = useWatch({ control: form.control })
  const [debouncedFilters] = useDebounce(watched, 500)

  useEffect(() => {
    onChange(cleanFilters(debouncedFilters))
  }, [debouncedFilters, onChange])

  return (
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
                      field.onChange(value === 'remove' ? '' : (value as Role))
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
  )
}
