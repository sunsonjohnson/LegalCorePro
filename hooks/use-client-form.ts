import { useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClientFormData } from '@/types/client'
import { clientFormSchema } from '@/lib/client-validations'
import { toast } from 'sonner'

interface UseClientFormOptions {
  initialData?: Partial<ClientFormData>
  onSubmit: (data: ClientFormData) => Promise<void>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useClientForm({
  initialData,
  onSubmit,
  onSuccess,
  onError
}: UseClientFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      clientType: 'INDIVIDUAL',
      preferredCommunication: 'EMAIL',
      notes: '',
      assignedToId: '',
      addresses: [{
        type: 'HOME',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        isPrimary: true
      }],
      contacts: [],
      tags: [],
      ...initialData
    },
    mode: 'onChange'
  })

  const { watch, trigger, getValues, setValue } = form

  // Watch for changes to update step completion
  const watchedValues = watch()

  // Form steps configuration
  const steps = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Client personal or business details',
      fields: ['firstName', 'lastName', 'email', 'phone', 'company', 'clientType']
    },
    {
      id: 'addresses',
      title: 'Addresses',
      description: 'Client addresses and locations',
      fields: ['addresses']
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      description: 'Emergency and business contacts',
      fields: ['contacts']
    },
    {
      id: 'preferences',
      title: 'Preferences & Assignment',
      description: 'Communication preferences and attorney assignment',
      fields: ['preferredCommunication', 'assignedToId', 'notes', 'tags']
    }
  ]

  // Validate current step
  const validateStep = async (stepIndex: number) => {
    const step = steps[stepIndex]
    const isValid = await trigger(step.fields as any)
    
    if (isValid) {
      setCompletedSteps(prev => Array.from(new Set([...prev, stepIndex])))
    } else {
      setCompletedSteps(prev => prev.filter(s => s !== stepIndex))
    }
    
    return isValid
  }

  // Navigate to next step
  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
    return isValid
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Go to specific step
  const goToStep = async (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Validate all previous steps
      let canProceed = true
      for (let i = 0; i < stepIndex; i++) {
        const isValid = await validateStep(i)
        if (!isValid) {
          canProceed = false
          break
        }
      }
      
      if (canProceed) {
        setCurrentStep(stepIndex)
      }
    }
  }

  // Add address
  const addAddress = () => {
    const addresses = getValues('addresses')
    setValue('addresses', [
      ...addresses,
      {
        type: 'OTHER',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        isPrimary: false
      }
    ])
  }

  // Remove address
  const removeAddress = (index: number) => {
    const addresses = getValues('addresses')
    if (addresses.length > 1) {
      const newAddresses = addresses.filter((_, i) => i !== index)
      // If we removed the primary address, make the first one primary
      if (addresses[index].isPrimary && newAddresses.length > 0) {
        newAddresses[0].isPrimary = true
      }
      setValue('addresses', newAddresses)
    }
  }

  // Set primary address
  const setPrimaryAddress = (index: number) => {
    const addresses = getValues('addresses')
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isPrimary: i === index
    }))
    setValue('addresses', newAddresses)
  }

  // Add contact
  const addContact = () => {
    const contacts = getValues('contacts')
    setValue('contacts', [
      ...contacts,
      {
        type: 'EMERGENCY',
        name: '',
        relationship: '',
        email: '',
        phone: '',
        isPrimary: contacts.length === 0,
        notes: ''
      }
    ])
  }

  // Remove contact
  const removeContact = (index: number) => {
    const contacts = getValues('contacts')
    setValue('contacts', contacts.filter((_, i) => i !== index))
  }

  // Add tag
  const addTag = (tag: string) => {
    const tags = getValues('tags')
    if (!tags.includes(tag)) {
      setValue('tags', [...tags, tag])
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    const tags = getValues('tags')
    setValue('tags', tags.filter(t => t !== tag))
  }

  // Handle form submission
  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast.success('Client saved successfully!')
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save client'
      toast.error(errorMessage)
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-save draft
  const saveDraft = () => {
    const draftKey = `client-draft-${initialData?.email || 'new'}`
    localStorage.setItem(draftKey, JSON.stringify(getValues()))
    toast.success('Draft saved')
  }

  // Load draft
  const loadDraft = () => {
    const draftKey = `client-draft-${initialData?.email || 'new'}`
    const draft = localStorage.getItem(draftKey)
    if (draft) {
      const draftData = JSON.parse(draft)
      Object.keys(draftData).forEach(key => {
        setValue(key as any, draftData[key])
      })
      toast.success('Draft loaded')
    }
  }

  // Clear draft
  const clearDraft = () => {
    const draftKey = `client-draft-${initialData?.email || 'new'}`
    localStorage.removeItem(draftKey)
  }

  // Calculate form progress
  const progress = useMemo(() => {
    const totalSteps = steps.length
    const currentProgress = ((currentStep + 1) / totalSteps) * 100
    const completionProgress = (completedSteps.length / totalSteps) * 100
    return {
      current: Math.round(currentProgress),
      completion: Math.round(completionProgress)
    }
  }, [currentStep, completedSteps.length, steps.length])

  return {
    // Form instance
    form,
    
    // State
    isSubmitting,
    currentStep,
    completedSteps,
    steps,
    progress,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    
    // Address management
    addAddress,
    removeAddress,
    setPrimaryAddress,
    
    // Contact management
    addContact,
    removeContact,
    
    // Tag management
    addTag,
    removeTag,
    
    // Form actions
    handleSubmit: form.handleSubmit(handleSubmit),
    saveDraft,
    loadDraft,
    clearDraft,
    
    // Utilities
    watchedValues
  }
}