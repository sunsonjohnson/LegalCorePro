export interface Client {
  id: string
  lawFirmId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  clientType: 'INDIVIDUAL' | 'BUSINESS' | 'ORGANIZATION'
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECTIVE' | 'FORMER'
  preferredCommunication: 'EMAIL' | 'PHONE' | 'SMS' | 'PORTAL'
  avatar?: string
  notes?: string
  createdAt: string
  updatedAt: string
  assignedToId: string
  assignedTo?: {
    id: string
    name: string
    email: string
  }
  addresses: ClientAddress[]
  contacts: ClientContact[]
  cases: ClientCase[]
  communications: ClientCommunication[]
  billingInfo?: ClientBillingInfo
  portalAccess?: ClientPortalAccess
  tags: string[]
}

export interface ClientAddress {
  id: string
  clientId: string
  type: 'HOME' | 'BUSINESS' | 'MAILING' | 'OTHER'
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isPrimary: boolean
}

export interface ClientContact {
  id: string
  clientId: string
  type: 'EMERGENCY' | 'BUSINESS' | 'PERSONAL' | 'LEGAL'
  name: string
  relationship: string
  email?: string
  phone?: string
  isPrimary: boolean
  notes?: string
}

export interface ClientCase {
  id: string
  caseNumber: string
  title: string
  status: string
  priority: string
  startDate: string
  closeDate?: string
}

export interface ClientCommunication {
  id: string
  clientId: string
  type: 'EMAIL' | 'PHONE' | 'SMS' | 'MEETING' | 'PORTAL_MESSAGE'
  subject?: string
  content: string
  direction: 'INBOUND' | 'OUTBOUND'
  timestamp: string
  userId: string
  user: {
    name: string
    email: string
  }
  isConfidential: boolean
  attachments?: string[]
}

export interface ClientBillingInfo {
  id: string
  clientId: string
  billingAddress: ClientAddress
  paymentMethods: PaymentMethod[]
  billingPreferences: {
    frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY'
    method: 'EMAIL' | 'MAIL' | 'PORTAL'
    currency: string
  }
}

export interface PaymentMethod {
  id: string
  type: 'CREDIT_CARD' | 'BANK_ACCOUNT' | 'CHECK' | 'WIRE'
  details: Record<string, any>
  isDefault: boolean
}

export interface ClientPortalAccess {
  id: string
  clientId: string
  username: string
  isActive: boolean
  lastLogin?: string
  permissions: string[]
  twoFactorEnabled: boolean
}

export interface ClientSearchFilters {
  query?: string
  status?: string[]
  clientType?: string[]
  assignedTo?: string[]
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
  location?: {
    city?: string
    state?: string
  }
}

export interface ClientFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  clientType: 'INDIVIDUAL' | 'BUSINESS' | 'ORGANIZATION'
  preferredCommunication: 'EMAIL' | 'PHONE' | 'SMS' | 'PORTAL'
  notes?: string
  assignedToId: string
  addresses: Omit<ClientAddress, 'id' | 'clientId'>[]
  contacts: Omit<ClientContact, 'id' | 'clientId'>[]
  tags: string[]
}

export interface ClientStats {
  totalClients: number
  activeClients: number
  newThisMonth: number
  averageResponseTime: number
  satisfactionScore: number
  revenuePerClient: number
}