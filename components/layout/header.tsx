'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Menu, Search, Bell, User } from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const { setSidebarOpen } = useStore()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search cases, clients, documents..."
              className="w-80 pl-10 bg-gray-50/50 border-gray-200/50 focus:bg-white"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-900 to-blue-700 text-white text-sm font-semibold">
                    JP
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border border-gray-200/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Partner</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john@legalcorepro.com
                  </p>
                  <Badge variant="secondary" className="mt-1 w-fit text-xs">
                    Partner
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}