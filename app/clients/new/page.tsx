'use client'

import { useRouter } from 'next/navigation'
import { ClientForm } from '@/components/clients/client-form'
import { ClientFormData } from '@/types/client'
import { toast } from 'sonner'

// Mock data - replace with actual API calls
const mockAttorneys = [
  { id: 'attorney-1', name: 'Sarah Chen' },
  { id: 'attorney-2', name: 'Michael Rodriguez' },
  { id: 'attorney-3', name: 'Emily Johnson' },
  { id: 'attorney-4', name: 'David Park' }
]

const mockTags = ['VIP', 'Corporate', 'Personal Injury', 'Non-profit', 'Pro Bono', 'Family Law', 'Real Estate']

export default function NewClientPage() {
  const router = useRouter()

  const handleSubmit = async (data: ClientFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would make an API call here
      console.log('Creating client:', data)
      
      toast.success('Client created successfully!')
      router.push('/clients')
    } catch (error) {
      throw new Error('Failed to create client')
    }
  }

  const handleCancel = () => {
    router.push('/clients')
  }

  return (
    <div className="p-6">
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        attorneys={mockAttorneys}
        availableTags={mockTags}
      />
    </div>
  )
}