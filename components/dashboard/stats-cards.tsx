'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Briefcase, Users, Clock, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
  {
    title: 'Active Cases',
    value: '47',
    change: '+12%',
    changeType: 'positive',
    icon: Briefcase,
    color: 'blue'
  },
  {
    title: 'Total Clients',
    value: '234',
    change: '+18%',
    changeType: 'positive',
    icon: Users,
    color: 'emerald'
  },
  {
    title: 'Billable Hours',
    value: '1,247',
    change: '+8%',
    changeType: 'positive',
    icon: Clock,
    color: 'amber'
  },
  {
    title: 'Monthly Revenue',
    value: '$124,750',
    change: '+23%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'green'
  }
]

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  green: 'from-green-500 to-green-600'
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span className={cn(
                    "text-sm font-medium ml-1",
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg",
                colorClasses[stat.color as keyof typeof colorClasses]
              )}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}