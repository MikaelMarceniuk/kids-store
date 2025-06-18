'use client'

import { Puzzle } from 'lucide-react'
import { Button } from '../ui/button'
import { SidebarTrigger } from '../ui/sidebar'
import { UserMenu } from './user-menu'

export const Header = () => {
  return (
    <header className="h-16 px-4 border-b border-border flex items-center justify-between bg-background">
      <div className="flex gap-4 items-center">
        <SidebarTrigger className="cursor-pointer" />

        <Button
          variant="ghost"
          className="flex gap-2 cursor-pointer"
        >
          <Puzzle />
          Kids Toy Store
        </Button>
      </div>

      {/* <div className="flex w-full md:w-2/3 lg:w-2/4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-9 bg-muted/50"
          />
        </div>
      </div> */}

      <div className="flex items-center space-x-4">
        <UserMenu />
      </div>
    </header>
  )
}
