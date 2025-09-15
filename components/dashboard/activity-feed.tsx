'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, FileText, User, Calendar, MessageSquare } from 'lucide-react'

const activities = [
  {
    id: '1',
    type: 'document',
    user: 'Sarah Chen',
    action: 'uploaded a new document',
    target: 'Corporate Merger Agreement - Final Draft.pdf',
    time: '10 minutes ago',
    icon: FileText,
    color: 'blue'
  },
  {
    id: '2',
    type: 'case',
    user: 'Michael Rodriguez',
    action: 'updated case status',
    target: 'Employment Contract Dispute',
    time: '1 hour ago',
    icon: User,
    color: 'green'
  },
  {
    id: '3',
    type: 'appointment',
    user: 'Emily Johnson',
    action: 'scheduled a meeting with',
    target: 'Innovation Labs',
    time: '2 hours ago',
    icon: Calendar,
    color: 'purple'
  },
  {
    id: '4',
    type: 'message',
    user: 'David Park',
    action: 'sent a message to',
    target: 'Property Holdings LLC',
    time: '3 hours ago',
    icon: MessageSquare,
    color: 'amber'
  },
  {
    id: '5',
    type: 'time',
    user: 'Sarah Chen',
    action: 'logged 3.5 hours for',
    target: 'Corporate Merger Agreement',
    time: '4 hours ago',
    icon: Clock,
    color: 'emerald'
  }
]

const iconColors = {
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  purple: 'text-purple-600 bg-purple-100',
  amber: 'text-amber-600 bg-amber-100',
  emerald: 'text-emerald-600 bg-emerald-100'
}

export function ActivityFeed() {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
      <CardHeader className="border-b border-gray-200/50">
        <CardTitle className="text-xl font-semibold text-gray-900">Activity Feed</CardTitle>
        <CardDescription className="text-gray-600">
          Recent activities across your firm
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 border-b border-gray-200/50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${iconColors[activity.color as keyof typeof iconColors]}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </span>
                    <span className="text-sm text-gray-600">
                      {activity.action}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-blue-700 mb-1">
                    {activity.target}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
                
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}