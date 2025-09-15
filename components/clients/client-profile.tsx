'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
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
  User,
  Building,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  DollarSign,
  Edit,
  MoreHorizontal,
  Trash2,
  UserPlus,
  Send,
  Download,
  Clock,
  Tag,
  Shield,
  Key
} from 'lucide-react'
import { Client } from '@/types/client'
import { formatClientName, getClientInitials, getClientStatusColor, formatPhoneNumber } from '@/lib/client-utils'
import { cn } from '@/lib/utils'

interface ClientProfileProps {
  client: Client
  onEdit: () => void
  onDelete: () => void
  onSendMessage: () => void
  onScheduleMeeting: () => void
}

export function ClientProfile({
  client,
  onEdit,
  onDelete,
  onSendMessage,
  onScheduleMeeting
}: ClientProfileProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL':
        return <User className="w-4 h-4" />
      case 'BUSINESS':
        return <Building className="w-4 h-4" />
      case 'ORGANIZATION':
        return <Users className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const primaryAddress = client.addresses.find(addr => addr.isPrimary) || client.addresses[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-4 border-gray-100">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 text-xl font-bold">
                  {getClientInitials(client)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formatClientName(client)}
                  </h1>
                  <Badge 
                    variant="secondary" 
                    className={getClientStatusColor(client.status)}
                  >
                    {client.status.charAt(0) + client.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    {getClientTypeIcon(client.clientType)}
                    <span>{client.clientType.charAt(0) + client.clientType.slice(1).toLowerCase()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Client since {new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {client.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>Assigned to {client.assignedTo.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`mailto:${client.email}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {client.email}
                  </a>
                  
                  {client.phone && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a 
                        href={`tel:${client.phone}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {formatPhoneNumber(client.phone)}
                      </a>
                    </>
                  )}
                </div>
                
                {client.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {client.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={onSendMessage} className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
              
              <Button variant="outline" onClick={onScheduleMeeting} className="gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Client
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Contact
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <Key className="w-4 h-4" />
                    Portal Access
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Client
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="portal">Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm text-gray-900">{client.email}</p>
                </div>
                
                {client.phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-sm text-gray-900">{formatPhoneNumber(client.phone)}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Preferred Communication</Label>
                  <p className="text-sm text-gray-900">
                    {client.preferredCommunication.charAt(0) + client.preferredCommunication.slice(1).toLowerCase()}
                  </p>
                </div>
                
                {client.company && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      {client.clientType === 'BUSINESS' ? 'Company' : 'Organization'}
                    </Label>
                    <p className="text-sm text-gray-900">{client.company}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {primaryAddress ? (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Primary Address ({primaryAddress.type})
                    </Label>
                    <div className="text-sm text-gray-900">
                      <p>{primaryAddress.street}</p>
                      <p>{primaryAddress.city}, {primaryAddress.state} {primaryAddress.zipCode}</p>
                      <p>{primaryAddress.country}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No address on file</p>
                )}
                
                {client.addresses.length > 1 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Additional Addresses
                    </Label>
                    <p className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                      View {client.addresses.length - 1} more addresses
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Cases</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {client.cases?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Communications</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {client.communications?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Emergency Contacts</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {client.contacts?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Portal Access</span>
                  <Badge 
                    variant={client.portalAccess?.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {client.portalAccess?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contacts */}
          {client.contacts && client.contacts.length > 0 && (
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {client.contacts.map((contact, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {contact.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{contact.relationship}</p>
                      {contact.email && (
                        <p className="text-sm text-blue-600">{contact.email}</p>
                      )}
                      {contact.phone && (
                        <p className="text-sm text-blue-600">{formatPhoneNumber(contact.phone)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {client.notes && (
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Client Cases</CardTitle>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Case
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {client.cases && client.cases.length > 0 ? (
                <div className="space-y-4">
                  {client.cases.map((case_item) => (
                    <div key={case_item.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{case_item.title}</h4>
                        <Badge variant="outline">
                          {case_item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Case #{case_item.caseNumber}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Started: {new Date(case_item.startDate).toLocaleDateString()}</span>
                        <span>Priority: {case_item.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases yet</h3>
                  <p className="text-gray-600 mb-4">This client doesn't have any cases assigned.</p>
                  <Button>Create First Case</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Communication History</CardTitle>
                <Button onClick={onSendMessage} className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {client.communications && client.communications.length > 0 ? (
                <div className="space-y-4">
                  {client.communications.map((comm) => (
                    <div key={comm.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {comm.type}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {comm.direction === 'INBOUND' ? 'From' : 'To'} {formatClientName(client)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comm.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {comm.subject && (
                        <h4 className="font-semibold text-gray-900 mb-2">{comm.subject}</h4>
                      )}
                      <p className="text-sm text-gray-700">{comm.content}</p>
                      {comm.isConfidential && (
                        <div className="flex items-center gap-1 mt-2">
                          <Shield className="w-3 h-3 text-amber-600" />
                          <span className="text-xs text-amber-600">Confidential</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No communications yet</h3>
                  <p className="text-gray-600 mb-4">Start a conversation with this client.</p>
                  <Button onClick={onSendMessage}>Send First Message</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Client Documents</CardTitle>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-600 mb-4">Upload documents for this client.</p>
                <Button>Upload First Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Billing Information</CardTitle>
                <Button className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No billing records</h3>
                <p className="text-gray-600 mb-4">Set up billing information for this client.</p>
                <Button>Set Up Billing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal" className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Client Portal Access</CardTitle>
              <CardDescription>
                Manage client portal access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {client.portalAccess ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Portal Status</h4>
                      <p className="text-sm text-gray-600">
                        Username: {client.portalAccess.username}
                      </p>
                      {client.portalAccess.lastLogin && (
                        <p className="text-sm text-gray-600">
                          Last login: {new Date(client.portalAccess.lastLogin).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant={client.portalAccess.isActive ? "default" : "secondary"}
                    >
                      {client.portalAccess.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Security Settings</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Two-Factor Authentication</span>
                      <Badge 
                        variant={client.portalAccess.twoFactorEnabled ? "default" : "secondary"}
                      >
                        {client.portalAccess.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No portal access</h3>
                  <p className="text-gray-600 mb-4">Set up client portal access for secure communication.</p>
                  <Button>Enable Portal Access</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {formatClientName(client)}? 
              This action cannot be undone and will remove all associated data including cases, 
              communications, and billing records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete()
                setShowDeleteDialog(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm font-medium text-gray-600", className)}>{children}</div>
}