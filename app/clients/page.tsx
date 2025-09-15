'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientSearch } from '@/components/clients/client-search'
import { ClientList } from '@/components/clients/client-list'
import { useClientSearch } from '@/hooks/use-client-search'
import { Client } from '@/types/client'
import { exportClientsToCSV, generateClientReport } from '@/lib/client-utils'
import { Plus, Users, TrendingUp, Building, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock data - replace with actual API calls
const mockClients: Client[] = [
  {
    id: '1',
    lawFirmId: 'firm-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    company: 'Smith Enterprises',
    clientType: 'BUSINESS',
    status: 'ACTIVE',
    preferredCommunication: 'EMAIL',
    notes: 'Important client with multiple ongoing cases',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    assignedToId: 'attorney-1',
    assignedTo: {
      id: 'attorney-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@legalcore.com'
    },
    addresses: [{
      id: 'addr-1',
      clientId: '1',
      type: 'BUSINESS',
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isPrimary: true
    }],
    contacts: [],
    cases: [
      {
        id: 'case-1',
        caseNumber: 'LC-2024-001',
        title: 'Corporate Merger',
        status: 'ACTIVE',
        priority: 'HIGH',
        startDate: '2024-01-15T00:00:00Z'
      }
    ],
    communications: [],
    tags: ['VIP', 'Corporate']
  },
  {
    id: '2',
    lawFirmId: 'firm-1',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@email.com',
    phone: '(555) 987-6543',
    clientType: 'INDIVIDUAL',
    status: 'ACTIVE',
    preferredCommunication: 'PHONE',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    assignedToId: 'attorney-2',
    assignedTo: {
      id: 'attorney-2',
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@legalcore.com'
    },
    addresses: [{
      id: 'addr-2',
      clientId: '2',
      type: 'HOME',
      street: '456 Residential St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US',
      isPrimary: true
    }],
    contacts: [],
    cases: [
      {
        id: 'case-2',
        caseNumber: 'LC-2024-002',
        title: 'Personal Injury',
        status: 'ACTIVE',
        priority: 'MEDIUM',
        startDate: '2024-01-10T00:00:00Z'
      }
    ],
    communications: [],
    tags: ['Personal Injury']
  },
  {
    id: '3',
    lawFirmId: 'firm-1',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@nonprofit.org',
    clientType: 'ORGANIZATION',
    status: 'PROSPECTIVE',
    preferredCommunication: 'EMAIL',
    company: 'Community Foundation',
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
    assignedToId: 'attorney-1',
    assignedTo: {
      id: 'attorney-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@legalcore.com'
    },
    addresses: [{
      id: 'addr-3',
      clientId: '3',
      type: 'BUSINESS',
      street: '789 Nonprofit Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'US',
      isPrimary: true
    }],
    contacts: [],
    cases: [],
    communications: [],
    tags: ['Non-profit', 'Pro Bono']
  }
]

const mockAttorneys = [
  { id: 'attorney-1', name: 'Sarah Chen' },
  { id: 'attorney-2', name: 'Michael Rodriguez' },
  { id: 'attorney-3', name: 'Emily Johnson' },
  { id: 'attorney-4', name: 'David Park' }
]

const mockTags = ['VIP', 'Corporate', 'Personal Injury', 'Non-profit', 'Pro Bono', 'Family Law', 'Real Estate']

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [isLoading, setIsLoading] = useState(false)

  const {
    clients: filteredClients,
    filters,
    sortField,
    sortOrder,
    selectedClients,
    searchStats,
    updateFilters,
    clearFilters,
    updateSort,
    toggleClientSelection,
    selectAllClients,
    clearSelection,
    isClientSelected,
    isAllSelected,
    saveSearch,
    getSavedSearches,
    applySavedSearch
  } = useClientSearch({
    clients,
    initialSort: { field: 'name', order: 'asc' }
  })

  // Generate client statistics
  const clientStats = generateClientReport(clients)

  const handleEdit = (client: Client) => {
    // Navigate to edit page or open edit modal
    toast.info(`Edit functionality for ${client.firstName} ${client.lastName}`)
  }

  const handleDelete = async (client: Client) => {
    try {
      setIsLoading(true)
      // API call to delete client
      setClients(prev => prev.filter(c => c.id !== client.id))
      toast.success(`${client.firstName} ${client.lastName} has been deleted`)
    } catch (error) {
      toast.error('Failed to delete client')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkAction = async (action: string, clientIds: string[]) => {
    try {
      setIsLoading(true)
      
      switch (action) {
        case 'DELETE':
          setClients(prev => prev.filter(c => !clientIds.includes(c.id)))
          toast.success(`${clientIds.length} clients deleted`)
          break
        case 'UPDATE_STATUS':
          // Open status update modal
          toast.info('Status update functionality')
          break
        case 'UPDATE_ASSIGNED_TO':
          // Open attorney reassignment modal
          toast.info('Attorney reassignment functionality')
          break
        case 'ADD_TAGS':
          // Open tag addition modal
          toast.info('Tag addition functionality')
          break
        default:
          break
      }
      
      clearSelection()
    } catch (error) {
      toast.error('Failed to perform bulk action')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const csv = exportClientsToCSV(filteredClients)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clients-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Client data exported successfully')
  }

  const handleSaveSearch = () => {
    const searchName = prompt('Enter a name for this search:')
    if (searchName) {
      saveSearch(searchName)
      toast.success('Search saved successfully')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
            Client Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your client relationships and information
          </p>
        </div>
        <Link href="/clients/new">
          <Button className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg gap-2">
            <Plus className="w-4 h-4" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{clientStats.total}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600 ml-1">
                    +{clientStats.growthRate}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">this month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{clientStats.active}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-blue-600">
                    {clientStats.activePercentage}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">of total</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Business Clients</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{clientStats.byType.business}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {clientStats.total > 0 ? Math.round((clientStats.byType.business / clientStats.total) * 100) : 0}% of total
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{clientStats.newThisMonth}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-500 ml-1">growth rate</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <ClientSearch
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        onSaveSearch={handleSaveSearch}
        onExport={handleExport}
        searchStats={searchStats}
        attorneys={mockAttorneys}
        availableTags={mockTags}
      />

      {/* Client List */}
      <ClientList
        clients={filteredClients}
        selectedClients={selectedClients}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={updateSort}
        onSelectClient={toggleClientSelection}
        onSelectAll={selectAllClients}
        onClearSelection={clearSelection}
        isAllSelected={isAllSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}