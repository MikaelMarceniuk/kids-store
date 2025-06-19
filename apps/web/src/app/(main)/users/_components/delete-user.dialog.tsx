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
import { useDeleteUser } from '../_hooks/delete-user.hook'

interface EditUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteUserDialog({
  userId,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const { mutate } = useDeleteUser()

  const handleDelete = () => {
    mutate({ userId }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4"></div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            onClick={handleDelete}
          >
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
