'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/common/components/ui/dropdown-menu'
import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'
import { DeleteUserDialog } from './delete-user.dialog'
import { EditUserDialog } from './edit-user.dialog'

interface UserActionsProps {
  userId: string
}

export function UserActions({ userId }: UserActionsProps) {
  const [isEditUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [isDeleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false)

  const handleEditClick = () => {
    setEditUserDialogOpen(true)
  }

  const handleDeleteClick = () => {
    setDeleteUserDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteClick}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        userId={userId}
        open={isEditUserDialogOpen}
        onOpenChange={setEditUserDialogOpen}
      />

      <DeleteUserDialog
        userId={userId}
        open={isDeleteUserDialogOpen}
        onOpenChange={setDeleteUserDialogOpen}
      />
    </>
  )
}
