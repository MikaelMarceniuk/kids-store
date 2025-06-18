'use client'

import { Avatar, AvatarFallback } from '@/src/common/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/common/components/ui/dropdown-menu'
import { ChevronDown, LogOut } from 'lucide-react'
import { useSession } from '../../hooks/use-session.hook'
import { Button } from '../ui/button'

export function UserMenu() {
  const { user, logout, getUserInitials } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-full cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{user?.name}</p>
            {user?.role && (
              <p className="text-xs text-muted-foreground">Administrador</p>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem className="cursor-pointer hover:bg-accent">
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem className="cursor-pointer hover:bg-accent">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          className="cursor-pointer hover:bg-destructive/30 focus:bg-destructive/30"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
