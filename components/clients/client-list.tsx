'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Eye,
  Edit,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building,
  User,
  Users,
  Calendar,
  FileText
} from 'lucide-react'
import { Client } from '@/types/client'
import { formatClientName, getClientInitials, getClientStatusColor, formatPhoneNumber } from '@/lib/client-utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ClientListProps {
  clients: Client[]
  selectedClients: string[]
  sortField: string
  sortOrder: 'asc' | 'desc'
  onSort: (field: string) => void
  onSelectClient: (clientId: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  isAllSelected: boolean
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
  onBulkAction: (action: string, clientIds: string[]) => void
}

export function ClientList({
  clients,
  selectedClients,
  sortField,
  sortOrder,
  onSort,
  onSelectClient,
  onSelectAll,
  onClearSelection,
  isAllSelected,
  onEdit,
  onDelete,
  onBulkAction
}: ClientListProps) {
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />
  }

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL':
        return <User className="w-4 h-4 text-gray-500" />
      case 'BUSINESS':
        return <Building className="w-4 h-4 text-gray-500" />
      case 'ORGANIZATION':
        return <Users className="w-4 h-4 text-gray-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      onDelete(clientToDelete)
      setClientToDelete(null)
    }
  }

  const handleBulkDelete = () => {
    if (selectedClients.length > 0) {
      onBulkAction('DELETE', selectedClients)
    }
  }

  return (
    <>
      <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader className="border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Clients ({clients.length})
            </CardTitle>
            
            {selectedClients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedClients.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearSelection}
                >
                  Clear
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onBulkAction('UPDATE_STATUS', selectedClients)}>
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('UPDATE_ASSIGNED_TO', selectedClients)}>
                      Reassign Attorney
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('ADD_TAGS', selectedClients)}>
                      Add Tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleBulkDelete}
                      className="text-red-600"
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-gray-200/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={isAllSelected ? onClearSelection : onSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-gray-50/50"
                  onClick={() => onSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Client
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-gray-50/50"
                  onClick={() => onSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Contact
                    {getSortIcon('email')}
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-gray-50/50"
                  onClick={() => onSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-gray-50/50"
                  onClick={() => onSort('assignedTo')}
                >
                  <div className="flex items-center gap-2">
                    Assigned To
                    {getSortIcon('assignedTo')}
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Cases</TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-gray-50/50"
                  onClick={() => onSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    {getSortIcon('createdAt')}
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="hover:bg-gray-50/50 transition-colors border-b border-gray-100/50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => onSelectClient(client.id)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-gray-100">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 font-semibold">
                          {getClientInitials(client)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link 
                          href={`/clients/${client.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-700 transition-colors"
                        >
                          {formatClientName(client)}
                        </Link>
                        {client.company && client.clientType === 'INDIVIDUAL' && (
                          <p className="text-sm text-gray-600">{client.company}</p>
                        )}
                        {client.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {client.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {client.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{client.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <a 
                          href={`mailto:${client.email}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {client.email}
                        </a>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a 
                            href={`tel:${client.phone}`}
                            className="hover:text-blue-600"
                          >
                            {formatPhoneNumber(client.phone)}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getClientTypeIcon(client.clientType)}
                      <span className="text-sm text-gray-700">
                        {client.clientType.charAt(0) + client.clientType.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={getClientStatusColor(client.status)}
                    >
                      {client.status.charAt(0) + client.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {client.assignedTo && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700">
                            {client.assignedTo.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {client.assignedTo.name}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {client.cases?.length || 0}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-gray-600">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/clients/${client.id}`} className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEdit(client)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule Meeting
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setClientToDelete(client)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {clients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-600 mb-4">
                No clients match your current search criteria.
              </p>
              <Button variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete && formatClientName(clientToDelete)}? 
              This action cannot be undone and will remove all associated data including cases, 
              communications, and billing records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}