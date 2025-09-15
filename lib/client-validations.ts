import { z } from 'zod'

export const clientAddressSchema = z.object({
  type: z.enum(['HOME', 'BUSINESS', 'MAILING', 'OTHER']),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(1, 'Country is required'),
  isPrimary: z.boolean()
})

export const clientContactSchema = z.object({
  type: z.enum(['EMERGENCY', 'BUSINESS', 'PERSONAL', 'LEGAL']),
  name: z.string().min(1, 'Contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  isPrimary: z.boolean(),
  notes: z.string().optional()
})

export const clientFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  clientType: z.enum(['INDIVIDUAL', 'BUSINESS', 'ORGANIZATION']),
  preferredCommunication: z.enum(['EMAIL', 'PHONE', 'SMS', 'PORTAL']),
  notes: z.string().optional(),
  assignedToId: z.string().min(1, 'Assigned attorney is required'),
  addresses: z.array(clientAddressSchema).min(1, 'At least one address is required'),
  contacts: z.array(clientContactSchema),
  tags: z.array(z.string())
}).refine(data => {
  // Ensure at least one primary address
  const primaryAddresses = data.addresses.filter(addr => addr.isPrimary)
  return primaryAddresses.length === 1
}, {
  message: 'Exactly one address must be marked as primary',
  path: ['addresses']
}).refine(data => {
  // If business type, company name is required
  if (data.clientType === 'BUSINESS' || data.clientType === 'ORGANIZATION') {
    return data.company && data.company.trim().length > 0
  }
  return true
}, {
  message: 'Company name is required for business clients',
  path: ['company']
})

export const clientSearchSchema = z.object({
  query: z.string().optional(),
  status: z.array(z.enum(['ACTIVE', 'INACTIVE', 'PROSPECTIVE', 'FORMER'])).optional(),
  clientType: z.array(z.enum(['INDIVIDUAL', 'BUSINESS', 'ORGANIZATION'])).optional(),
  assignedTo: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.string(),
    end: z.string()
  }).optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional()
  }).optional()
})

export const clientCommunicationSchema = z.object({
  type: z.enum(['EMAIL', 'PHONE', 'SMS', 'MEETING', 'PORTAL_MESSAGE']),
  subject: z.string().optional(),
  content: z.string().min(1, 'Message content is required'),
  isConfidential: z.boolean().default(true),
  attachments: z.array(z.string()).optional()
})

export const clientPortalAccessSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  isActive: z.boolean(),
  permissions: z.array(z.string()),
  twoFactorEnabled: z.boolean()
})

export const bulkClientActionSchema = z.object({
  action: z.enum(['DELETE', 'UPDATE_STATUS', 'UPDATE_ASSIGNED_TO', 'ADD_TAGS', 'REMOVE_TAGS']),
  clientIds: z.array(z.string()).min(1, 'At least one client must be selected'),
  data: z.record(z.any()).optional()
})

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export function validateZipCode(zipCode: string, country: string = 'US'): boolean {
  if (country === 'US') {
    return /^\d{5}(-\d{4})?$/.test(zipCode)
  }
  // Add other country validations as needed
  return zipCode.length >= 3
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function validateClientUniqueness(email: string, existingClients: any[], excludeId?: string): boolean {
  return !existingClients.some(client => 
    client.email.toLowerCase() === email.toLowerCase() && 
    client.id !== excludeId
  )
}