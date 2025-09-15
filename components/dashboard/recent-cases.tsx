'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowRight, Clock, User } from 'lucide-react'
import Link from 'next/link'

const recentCases = [
  {
    id: '1',
    title: 'Corporate Merger Agreement',
    client: 'TechStart Inc.',
    assignedTo: 'Sarah Chen',
    status: 'In Progress',
    priority: 'High',
    lastUpdate: '2 hours ago',
    statusColor: 'blue'
  },
  {
    id: '2',
    title: 'Employment Contract Dispute',
    client: 'GlobalTech Corp',
    assignedTo: 'Michael Rodriguez',
    status: 'Review',
    priority: 'Medium',
    lastUpdate: '5 hours ago',
    statusColor: 'amber'
  },
  {
    id: '3',
    title: 'Intellectual Property Filing',
    client: 'Innovation Labs',
    assignedTo: 'Emily Johnson',
    status: 'Open',
    priority: 'Low',
    lastUpdate: '1 day ago',
    statusColor: 'gray'
  },
  {
    id: '4',
    title: 'Real Estate Transaction',
    client: 'Property Holdings LLC',
    assignedTo: 'David Park',
    status: 'Closed',
    priority: 'Medium',
    lastUpdate: '3 days ago',
    statusColor: 'green'
  }
]

const statusColors = {
  blue: 'bg-blue-100 text-blue-800',
  amber: 'bg-amber-100 text-amber-800',
  gray: 'bg-gray-100 text-gray-800',
  green: 'bg-green-100 text-green-800'
}

const priorityColors = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800'
}

export function RecentCases() {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
      <CardHeader className="border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Recent Cases</CardTitle>
            <CardDescription className="text-gray-600">
              Latest case updates and activities
            </CardDescription>
          </div>
          <Link href="/cases">
            <Button variant="outline" size="sm" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200/50">
          {recentCases.map((case_item) => (
            <div key={case_item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {case_item.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={statusColors[case_item.statusColor as keyof typeof statusColors]}
                    >
                      {case_item.status}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={priorityColors[case_item.priority as keyof typeof priorityColors]}
                    >
                      {case_item.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {case_item.client}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {case_item.lastUpdate}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                      {case_item.assignedTo.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {case_item.assignedTo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}