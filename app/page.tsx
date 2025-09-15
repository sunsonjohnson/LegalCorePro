'use client'

import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentCases } from '@/components/dashboard/recent-cases'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, Clock, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
            Welcome back, John
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at your law firm today
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg">
            New Case
          </Button>
          <Button variant="outline" className="border-gray-200/50 shadow-sm">
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Cases - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <RecentCases />
        </div>

        {/* Activity Feed - Takes 1 column */}
        <div className="xl:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Client Meeting</p>
                  <p className="text-xs text-gray-600">10:00 AM - TechStart Inc.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <Clock className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Court Hearing</p>
                  <p className="text-xs text-gray-600">2:30 PM - Property Case</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800">Document Review Due</p>
                <p className="text-xs text-red-600">Merger Agreement - Due Today</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-800">Client Response Needed</p>
                <p className="text-xs text-orange-600">Employment Dispute - 2 days overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="text-lg font-semibold text-gray-900">Revenue Summary</CardTitle>
            <CardDescription>This month's financial overview</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billed Hours</span>
                  <span className="font-medium">847.5h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Collected</span>
                  <span className="font-medium">$98,750</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}