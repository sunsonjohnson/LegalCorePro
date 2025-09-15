import { useState, useEffect, useMemo } from 'react'
import { Client, ClientSearchFilters } from '@/types/client'
import { filterClients, sortClients } from '@/lib/client-utils'

interface UseClientSearchOptions {
  clients: Client[]
  initialFilters?: ClientSearchFilters
  initialSort?: {
    field: string
    order: 'asc' | 'desc'
  }
}

export function useClientSearch({
  clients,
  initialFilters = {},
  initialSort = { field: 'name', order: 'asc' }
}: UseClientSearchOptions) {
  const [filters, setFilters] = useState<ClientSearchFilters>(initialFilters)
  const [sortField, setSortField] = useState(initialSort.field)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSort.order)
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    const filtered = filterClients(clients, filters)
    return sortClients(filtered, sortField, sortOrder)
  }, [clients, filters, sortField, sortOrder])

  // Update filters
  const updateFilters = (newFilters: Partial<ClientSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({})
  }

  // Update sort
  const updateSort = (field: string, order?: 'asc' | 'desc') => {
    if (field === sortField && !order) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder(order || 'asc')
    }
  }

  // Selection management
  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const selectAllClients = () => {
    setSelectedClients(filteredAndSortedClients.map(client => client.id))
  }

  const clearSelection = () => {
    setSelectedClients([])
  }

  const isClientSelected = (clientId: string) => {
    return selectedClients.includes(clientId)
  }

  const isAllSelected = selectedClients.length === filteredAndSortedClients.length && filteredAndSortedClients.length > 0

  // Search statistics
  const searchStats = useMemo(() => {
    const total = clients.length
    const filtered = filteredAndSortedClients.length
    const selected = selectedClients.length

    return {
      total,
      filtered,
      selected,
      hasFilters: Object.keys(filters).some(key => {
        const value = filters[key as keyof ClientSearchFilters]
        return value !== undefined && value !== '' && 
               (Array.isArray(value) ? value.length > 0 : true)
      })
    }
  }, [clients.length, filteredAndSortedClients.length, selectedClients.length, filters])

  // Save search query
  const saveSearch = (name: string) => {
    const savedSearches = JSON.parse(localStorage.getItem('clientSavedSearches') || '[]')
    const newSearch = {
      id: Date.now().toString(),
      name,
      filters,
      sortField,
      sortOrder,
      createdAt: new Date().toISOString()
    }
    savedSearches.push(newSearch)
    localStorage.setItem('clientSavedSearches', JSON.stringify(savedSearches))
    return newSearch
  }

  // Load saved searches
  const getSavedSearches = () => {
    return JSON.parse(localStorage.getItem('clientSavedSearches') || '[]')
  }

  // Apply saved search
  const applySavedSearch = (searchId: string) => {
    const savedSearches = getSavedSearches()
    const search = savedSearches.find((s: any) => s.id === searchId)
    if (search) {
      setFilters(search.filters)
      setSortField(search.sortField)
      setSortOrder(search.sortOrder)
    }
  }

  return {
    // Data
    clients: filteredAndSortedClients,
    filters,
    sortField,
    sortOrder,
    selectedClients,
    searchStats,

    // Filter methods
    updateFilters,
    clearFilters,

    // Sort methods
    updateSort,

    // Selection methods
    toggleClientSelection,
    selectAllClients,
    clearSelection,
    isClientSelected,
    isAllSelected,

    // Saved searches
    saveSearch,
    getSavedSearches,
    applySavedSearch
  }
}