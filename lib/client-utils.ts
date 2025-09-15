import { Client, ClientSearchFilters } from '@/types/client'

export function formatClientName(client: Client): string {
  if (client.clientType === 'BUSINESS' && client.company) {
    return client.company
  }
  return `${client.firstName} ${client.lastName}`
}

export function getClientInitials(client: Client): string {
  if (client.clientType === 'BUSINESS' && client.company) {
    return client.company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return `${client.firstName[0]}${client.lastName[0]}`.toUpperCase()
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function getClientStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800'
    case 'PROSPECTIVE':
      return 'bg-blue-100 text-blue-800'
    case 'FORMER':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getClientTypeIcon(type: string): string {
  switch (type) {
    case 'INDIVIDUAL':
      return '👤'
    case 'BUSINESS':
      return '🏢'
    case 'ORGANIZATION':
      return '🏛️'
    default:
      return '👤'
  }
}

export function filterClients(clients: Client[], filters: ClientSearchFilters): Client[] {
  return clients.filter(client => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      const searchText = `${client.firstName} ${client.lastName} ${client.email} ${client.company || ''}`.toLowerCase()
      if (!searchText.includes(query)) return false
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(client.status)) return false
    }

    // Client type filter
    if (filters.clientType && filters.clientType.length > 0) {
      if (!filters.clientType.includes(client.clientType)) return false
    }

    // Assigned to filter
    if (filters.assignedTo && filters.assignedTo.length > 0) {
      if (!filters.assignedTo.includes(client.assignedToId)) return false
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => client.tags.includes(tag))
      if (!hasMatchingTag) return false
    }

    // Date range filter
    if (filters.dateRange) {
      const clientDate = new Date(client.createdAt)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      if (clientDate < startDate || clientDate > endDate) return false
    }

    return true
  })
}

export function sortClients(clients: Client[], sortBy: string, sortOrder: 'asc' | 'desc'): Client[] {
  return [...clients].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = formatClientName(a).toLowerCase()
        bValue = formatClientName(b).toLowerCase()
        break
      case 'email':
        aValue = a.email.toLowerCase()
        bValue = b.email.toLowerCase()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'createdAt':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case 'assignedTo':
        aValue = a.assignedTo?.name || ''
        bValue = b.assignedTo?.name || ''
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
}

export function exportClientsToCSV(clients: Client[]): string {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Company',
    'Type',
    'Status',
    'Assigned To',
    'Created Date',
    'Tags'
  ]

  const rows = clients.map(client => [
    formatClientName(client),
    client.email,
    client.phone || '',
    client.company || '',
    client.clientType,
    client.status,
    client.assignedTo?.name || '',
    new Date(client.createdAt).toLocaleDateString(),
    client.tags.join('; ')
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  return csvContent
}

export function generateClientReport(clients: Client[]) {
  const total = clients.length
  const active = clients.filter(c => c.status === 'ACTIVE').length
  const prospective = clients.filter(c => c.status === 'PROSPECTIVE').length
  const inactive = clients.filter(c => c.status === 'INACTIVE').length

  const byType = {
    individual: clients.filter(c => c.clientType === 'INDIVIDUAL').length,
    business: clients.filter(c => c.clientType === 'BUSINESS').length,
    organization: clients.filter(c => c.clientType === 'ORGANIZATION').length
  }

  const thisMonth = new Date()
  thisMonth.setMonth(thisMonth.getMonth() - 1)
  const newThisMonth = clients.filter(c => new Date(c.createdAt) > thisMonth).length

  return {
    total,
    active,
    prospective,
    inactive,
    byType,
    newThisMonth,
    activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
    growthRate: total > 0 ? Math.round((newThisMonth / total) * 100) : 0
  }
}