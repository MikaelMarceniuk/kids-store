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
import { EditUserDialog } from './edit-user.dialog'

interface UserActionsProps {
  userId: string
}

export function UserActions({ userId }: UserActionsProps) {
  const [open, setOpen] = useState(false)

  const handleEditClick = () => {
    setOpen(true)
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
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        userId={userId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
