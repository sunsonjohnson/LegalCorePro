'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, Filter, Eye, Edit, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const cases = [
  {
    id: '1',
    caseNumber: 'LC-2024-001',
    title: 'Corporate Merger Agreement',
    client: 'TechStart Inc.',
    assignedTo: 'Sarah Chen',
    status: 'In Progress',
    priority: 'High',
    startDate: '2024-01-15',
    lastUpdate: '2024-01-20',
    billedHours: 45.5,
    statusColor: 'blue'
  },
  {
    id: '2',
    caseNumber: 'LC-2024-002',
    title: 'Employment Contract Dispute',
    client: 'GlobalTech Corp',
    assignedTo: 'Michael Rodriguez',
    status: 'Review',
    priority: 'Medium',
    startDate: '2024-01-10',
    lastUpdate: '2024-01-18',
    billedHours: 32.0,
    statusColor: 'amber'
  },
  {
    id: '3',
    caseNumber: 'LC-2024-003',
    title: 'Intellectual Property Filing',
    client: 'Innovation Labs',
    assignedTo: 'Emily Johnson',
    status: 'Open',
    priority: 'Low',
    startDate: '2024-01-05',
    lastUpdate: '2024-01-19',
    billedHours: 18.5,
    statusColor: 'gray'
  },
  {
    id: '4',
    caseNumber: 'LC-2024-004',
    title: 'Real Estate Transaction',
    client: 'Property Holdings LLC',
    assignedTo: 'David Park',
    status: 'Closed',
    priority: 'Medium',
    startDate: '2023-12-20',
    lastUpdate: '2024-01-17',
    billedHours: 67.0,
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

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
            Case Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your legal cases
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg gap-2">
          <Plus className="w-4 h-4" />
          New Case
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cases by title, client, or case number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50/50 border-gray-200/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Active Cases
          </CardTitle>
          <CardDescription>
            {cases.length} total cases
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-gray-200/50">
                <TableHead className="font-semibold">Case Number</TableHead>
                <TableHead className="font-semibold">Title & Client</TableHead>
                <TableHead className="font-semibold">Assigned To</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Hours</TableHead>
                <TableHead className="font-semibold">Last Update</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((case_item) => (
                <TableRow key={case_item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100/50">
                  <TableCell className="font-medium text-blue-700">
                    {case_item.caseNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {case_item.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {case_item.client}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                          {case_item.assignedTo.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900">
                        {case_item.assignedTo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={statusColors[case_item.statusColor as keyof typeof statusColors]}
                    >
                      {case_item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={priorityColors[case_item.priority as keyof typeof priorityColors]}
                    >
                      {case_item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {case_item.billedHours}h
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(case_item.lastUpdate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-4 h-4" />
                          Edit Case
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}