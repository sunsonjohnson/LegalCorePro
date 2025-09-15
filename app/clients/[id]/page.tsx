'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClientProfile } from '@/components/clients/client-profile'
import { Client } from '@/types/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Mock client data - replace with actual API call
const mockClient: Client = {
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
  avatar: '',
  notes: 'Important client with multiple ongoing cases. Prefers email communication and has specific requirements for document formatting. Very detail-oriented and appreciates regular updates on case progress.',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
  assignedToId: 'attorney-1',
  assignedTo: {
    id: 'attorney-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@legalcore.com'
  },
  addresses: [
    {
      id: 'addr-1',
      clientId: '1',
      type: 'BUSINESS',
      street: '123 Business Avenue, Suite 500',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isPrimary: true
    },
    {
      id: 'addr-2',
      clientId: '1',
      type: 'MAILING',
      street: '456 Mailing Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'US',
      isPrimary: false
    }
  ],
  contacts: [
    {
      id: 'contact-1',
      clientId: '1',
      type: 'EMERGENCY',
      name: 'Jane Smith',
      relationship: 'Spouse',
      email: 'jane.smith@email.com',
      phone: '(555) 987-6543',
      isPrimary: true,
      notes: 'Primary emergency contact, available 24/7'
    },
    {
      id: 'contact-2',
      clientId: '1',
      type: 'BUSINESS',
      name: 'Robert Johnson',
      relationship: 'Business Partner',
      email: 'robert.johnson@smithenterprises.com',
      phone: '(555) 456-7890',
      isPrimary: false,
      notes: 'Co-founder and business partner'
    }
  ],
  cases: [
    {
      id: 'case-1',
      caseNumber: 'LC-2024-001',
      title: 'Corporate Merger Agreement',
      status: 'ACTIVE',
      priority: 'HIGH',
      startDate: '2024-01-15T00:00:00Z'
    },
    {
      id: 'case-2',
      caseNumber: 'LC-2024-005',
      title: 'Intellectual Property Protection',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      startDate: '2024-01-20T00:00:00Z'
    }
  ],
  communications: [
    {
      id: 'comm-1',
      clientId: '1',
      type: 'EMAIL',
      subject: 'Merger Agreement Review',
      content: 'Please review the attached merger agreement documents. I have a few questions about the liability clauses in section 4.2.',
      direction: 'INBOUND',
      timestamp: '2024-01-22T14:30:00Z',
      userId: 'attorney-1',
      user: {
        name: 'Sarah Chen',
        email: 'sarah.chen@legalcore.com'
      },
      isConfidential: true,
      attachments: ['merger-agreement-v2.pdf']
    },
    {
      id: 'comm-2',
      clientId: '1',
      type: 'PHONE',
      content: 'Discussed timeline for merger completion and regulatory approval process. Client expressed concerns about potential delays.',
      direction: 'OUTBOUND',
      timestamp: '2024-01-21T10:15:00Z',
      userId: 'attorney-1',
      user: {
        name: 'Sarah Chen',
        email: 'sarah.chen@legalcore.com'
      },
      isConfidential: true
    }
  ],
  billingInfo: {
    id: 'billing-1',
    clientId: '1',
    billingAddress: {
      id: 'addr-1',
      clientId: '1',
      type: 'BUSINESS',
      street: '123 Business Avenue, Suite 500',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isPrimary: true
    },
    paymentMethods: [
      {
        id: 'payment-1',
        type: 'CREDIT_CARD',
        details: { last4: '4567', brand: 'Visa' },
        isDefault: true
      }
    ],
    billingPreferences: {
      frequency: 'MONTHLY',
      method: 'EMAIL',
      currency: 'USD'
    }
  },
  portalAccess: {
    id: 'portal-1',
    clientId: '1',
    username: 'john.smith',
    isActive: true,
    lastLogin: '2024-01-21T09:30:00Z',
    permissions: ['VIEW_CASES', 'VIEW_DOCUMENTS', 'SEND_MESSAGES'],
    twoFactorEnabled: true
  },
  tags: ['VIP', 'Corporate', 'High-Value']
}

interface ClientDetailPageProps {
  params: {
    id: string
  }
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real app, you would fetch the client by ID
        if (params.id === '1') {
          setClient(mockClient)
        } else {
          setError('Client not found')
        }
      } catch (err) {
        setError('Failed to load client')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClient()
  }, [params.id])

  const handleEdit = () => {
    router.push(`/clients/${params.id}/edit`)
  }

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Client deleted successfully')
      router.push('/clients')
    } catch (error) {
      toast.error('Failed to delete client')
    }
  }

  const handleSendMessage = () => {
    // Open message composer or navigate to messages
    toast.info('Message composer functionality')
  }

  const handleScheduleMeeting = () => {
    // Open calendar or navigate to scheduling
    toast.info('Meeting scheduler functionality')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading client information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Client not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The client you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/clients')}>
            Return to Clients
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="text-sm text-gray-600">
          <span>Clients</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">
            {client.firstName} {client.lastName}
          </span>
        </div>
      </div>

      {/* Client Profile */}
      <ClientProfile
        client={client}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSendMessage={handleSendMessage}
        onScheduleMeeting={handleScheduleMeeting}
      />
    </div>
  )
}