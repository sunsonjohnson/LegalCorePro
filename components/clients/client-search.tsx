'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  Save,
  Download,
  Users,
  Building,
  User
} from 'lucide-react'
import { ClientSearchFilters } from '@/types/client'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'

interface ClientSearchProps {
  filters: ClientSearchFilters
  onFiltersChange: (filters: Partial<ClientSearchFilters>) => void
  onClearFilters: () => void
  onSaveSearch: () => void
  onExport: () => void
  searchStats: {
    total: number
    filtered: number
    hasFilters: boolean
  }
  attorneys: Array<{ id: string; name: string }>
  availableTags: string[]
}

export function ClientSearch({
  filters,
  onFiltersChange,
  onClearFilters,
  onSaveSearch,
  onExport,
  searchStats,
  attorneys,
  availableTags
}: ClientSearchProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.dateRange 
      ? {
          from: new Date(filters.dateRange.start),
          to: new Date(filters.dateRange.end)
        }
      : undefined
  )

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range)
      if (range.from) {
        onFiltersChange({
          dateRange: {
            start: range.from.toISOString(),
            end: (range.to || range.from).toISOString()
          }
        })
      } else {
        onFiltersChange({ dateRange: undefined })
      }
    } else {
      setDateRange(undefined)
      onFiltersChange({ dateRange: undefined })
    }
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatus = filters.status || []
    const newStatus = checked
      ? [...currentStatus, status]
      : currentStatus.filter(s => s !== status)
    
    onFiltersChange({ status: newStatus.length > 0 ? newStatus : undefined })
  }

  const handleClientTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.clientType || []
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type)
    
    onFiltersChange({ clientType: newTypes.length > 0 ? newTypes : undefined })
  }

  const handleAssignedToChange = (attorneyId: string, checked: boolean) => {
    const currentAssigned = filters.assignedTo || []
    const newAssigned = checked
      ? [...currentAssigned, attorneyId]
      : currentAssigned.filter(a => a !== attorneyId)
    
    onFiltersChange({ assignedTo: newAssigned.length > 0 ? newAssigned : undefined })
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = filters.tags || []
    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter(t => t !== tag)
    
    onFiltersChange({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.status?.length) count++
    if (filters.clientType?.length) count++
    if (filters.assignedTo?.length) count++
    if (filters.tags?.length) count++
    if (filters.dateRange) count++
    if (filters.location?.city || filters.location?.state) count++
    return count
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
      <CardContent className="p-6 space-y-4">
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients by name, email, company..."
              value={filters.query || ''}
              onChange={(e) => onFiltersChange({ query: e.target.value || undefined })}
              className="pl-10 bg-gray-50/50 border-gray-200/50 focus:bg-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(
                "gap-2",
                getActiveFiltersCount() > 0 && "border-blue-500 text-blue-700"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
            
            <Button variant="outline" onClick={onSaveSearch} className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
            
            <Button variant="outline" onClick={onExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Search Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              Showing {searchStats.filtered.toLocaleString()} of {searchStats.total.toLocaleString()} clients
            </span>
            {searchStats.hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-blue-600 hover:text-blue-700 gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t border-gray-200/50 pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Status</Label>
                <div className="space-y-2">
                  {[
                    { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
                    { value: 'PROSPECTIVE', label: 'Prospective', color: 'bg-blue-100 text-blue-800' },
                    { value: 'INACTIVE', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
                    { value: 'FORMER', label: 'Former', color: 'bg-red-100 text-red-800' }
                  ].map(status => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={filters.status?.includes(status.value) || false}
                        onCheckedChange={(checked) => 
                          handleStatusChange(status.value, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`status-${status.value}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Badge variant="secondary" className={status.color}>
                          {status.label}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Type Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Client Type</Label>
                <div className="space-y-2">
                  {[
                    { value: 'INDIVIDUAL', label: 'Individual', icon: User },
                    { value: 'BUSINESS', label: 'Business', icon: Building },
                    { value: 'ORGANIZATION', label: 'Organization', icon: Users }
                  ].map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={filters.clientType?.includes(type.value) || false}
                        onCheckedChange={(checked) => 
                          handleClientTypeChange(type.value, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`type-${type.value}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <type.icon className="w-4 h-4 text-gray-500" />
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Attorney Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Assigned Attorney</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {attorneys.map(attorney => (
                    <div key={attorney.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`attorney-${attorney.id}`}
                        checked={filters.assignedTo?.includes(attorney.id) || false}
                        onCheckedChange={(checked) => 
                          handleAssignedToChange(attorney.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`attorney-${attorney.id}`}
                        className="cursor-pointer text-sm"
                      >
                        {attorney.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Range Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange?.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Tags</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableTags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={filters.tags?.includes(tag) || false}
                        onCheckedChange={(checked) => 
                          handleTagChange(tag, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`tag-${tag}`}
                        className="cursor-pointer text-sm"
                      >
                        <Badge variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {searchStats.hasFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200/50">
            {filters.status?.map(status => (
              <Badge key={status} variant="secondary" className="gap-1">
                Status: {status}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleStatusChange(status, false)}
                />
              </Badge>
            ))}
            {filters.clientType?.map(type => (
              <Badge key={type} variant="secondary" className="gap-1">
                Type: {type}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleClientTypeChange(type, false)}
                />
              </Badge>
            ))}
            {filters.assignedTo?.map(attorneyId => {
              const attorney = attorneys.find(a => a.id === attorneyId)
              return (
                <Badge key={attorneyId} variant="secondary" className="gap-1">
                  Attorney: {attorney?.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleAssignedToChange(attorneyId, false)}
                  />
                </Badge>
              )
            })}
            {filters.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                Tag: {tag}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleTagChange(tag, false)}
                />
              </Badge>
            ))}
            {filters.dateRange && (
              <Badge variant="secondary" className="gap-1">
                Date: {format(new Date(filters.dateRange.start), "MMM dd")} - {format(new Date(filters.dateRange.end), "MMM dd")}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleDateRangeChange(undefined)}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}