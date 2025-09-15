'use client'

import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { ScalesLogo } from '@/components/ui/scales-logo'
import { Button } from '@/components/ui/button'
import {
  Home,
  Users,
  Briefcase,
  FileText,
  Clock,
  CreditCard,
  Calendar,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Cases', href: '/cases', icon: Briefcase },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Time Tracking', href: '/time', icon: Clock },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useStore()
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-xl transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16",
          "lg:static lg:translate-x-0",
          !sidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className={cn(
            "flex items-center gap-3 transition-opacity duration-200",
            !sidebarOpen && "lg:opacity-0"
          )}>
            <ScalesLogo className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              LegalCore Pro
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      "hover:bg-blue-50 hover:text-blue-700 group",
                      isActive 
                        ? "bg-blue-900 text-white shadow-lg" 
                        : "text-gray-700",
                      !sidebarOpen && "lg:justify-center lg:px-2"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                    )} />
                    <span className={cn(
                      "transition-opacity duration-200",
                      !sidebarOpen && "lg:opacity-0 lg:sr-only"
                    )}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-gray-200/50 transition-opacity duration-200",
          !sidebarOpen && "lg:opacity-0"
        )}>
          <div className="text-xs text-gray-500 text-center">
            LegalCore Pro v1.0
          </div>
        </div>
      </aside>
    </>
  )
}