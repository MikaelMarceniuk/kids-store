'use client'

import { Button } from '@/src/common/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/common/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/common/components/ui/form'
import { Input } from '@/src/common/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/common/components/ui/select'
import { Role } from '@/src/common/types/role.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useGetUserDetails } from '../_hooks/get-user-details.hook'
import { useUpdateUser } from '../_hooks/update-user.hook'

const schema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: z.nativeEnum(Role),
})

type Schema = z.infer<typeof schema>

interface EditUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({
  userId,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      name: '',
      role: undefined,
    },
  })

  const { user, isSuccess } = useGetUserDetails({ userId, isEnabled: open })
  const { mutate } = useUpdateUser()

  useEffect(() => {
    if (isSuccess && user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    }
  }, [isSuccess, user, form])

  const onSubmit = form.handleSubmit((data) =>
    mutate(
      {
        userId,
        ...data,
      },
      { onSuccess: () => onOpenChange(false) }
    )
  )

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Make changes to the user&apos;s details below and click
                &quot;Create User&quot; to save your changes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value as Role)
                          }
                          value={field.value ?? ''}
                        >
                          <SelectTrigger className="w-full">
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
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
