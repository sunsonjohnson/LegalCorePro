'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Plus,
  Trash2,
  User,
  Building,
  Users,
  MapPin,
  Phone,
  Mail,
  Tag,
  Save,
  ArrowLeft,
  ArrowRight,
  Check,
  X
} from 'lucide-react'
import { useClientForm } from '@/hooks/use-client-form'
import { ClientFormData } from '@/types/client'
import { cn } from '@/lib/utils'

interface ClientFormProps {
  initialData?: Partial<ClientFormData>
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  attorneys: Array<{ id: string; name: string }>
  availableTags: string[]
}

export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  attorneys,
  availableTags
}: ClientFormProps) {
  const [newTag, setNewTag] = useState('')

  const {
    form,
    isSubmitting,
    currentStep,
    completedSteps,
    steps,
    progress,
    nextStep,
    prevStep,
    goToStep,
    addAddress,
    removeAddress,
    setPrimaryAddress,
    addContact,
    removeContact,
    addTag,
    removeTag,
    handleSubmit,
    saveDraft,
    watchedValues
  } = useClientForm({
    initialData,
    onSubmit,
    onSuccess: () => {
      // Handle success (e.g., redirect)
    }
  })

  const { register, formState: { errors }, watch, setValue, getValues } = form

  const clientType = watch('clientType')
  const addresses = watch('addresses')
  const contacts = watch('contacts')
  const tags = watch('tags')

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      addTag(newTag.trim())
      setNewTag('')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className={cn(errors.firstName && "border-red-500")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className={cn(errors.lastName && "border-red-500")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientType">Client Type *</Label>
              <Select
                value={clientType}
                onValueChange={(value) => setValue('clientType', value as any)}
              >
                <SelectTrigger className={cn(errors.clientType && "border-red-500")}>
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Individual
                    </div>
                  </SelectItem>
                  <SelectItem value="BUSINESS">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Business
                    </div>
                  </SelectItem>
                  <SelectItem value="ORGANIZATION">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Organization
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.clientType && (
                <p className="text-sm text-red-600">{errors.clientType.message}</p>
              )}
            </div>

            {(clientType === 'BUSINESS' || clientType === 'ORGANIZATION') && (
              <div className="space-y-2">
                <Label htmlFor="company">
                  {clientType === 'BUSINESS' ? 'Company Name' : 'Organization Name'} *
                </Label>
                <Input
                  id="company"
                  {...register('company')}
                  className={cn(errors.company && "border-red-500")}
                />
                {errors.company && (
                  <p className="text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="preferredCommunication">Preferred Communication Method</Label>
              <Select
                value={watch('preferredCommunication')}
                onValueChange={(value) => setValue('preferredCommunication', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="PHONE">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                  </SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="PORTAL">Client Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 1: // Addresses
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Client Addresses</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addAddress}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </Button>
            </div>

            {addresses.map((address, index) => (
              <Card key={index} className="border-gray-200/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Address {index + 1}</span>
                      {address.isPrimary && (
                        <Badge variant="secondary" className="text-xs">Primary</Badge>
                      )}
                    </div>
                    {addresses.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAddress(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Address Type</Label>
                      <Select
                        value={address.type}
                        onValueChange={(value) => {
                          const newAddresses = [...addresses]
                          newAddresses[index].type = value as any
                          setValue('addresses', newAddresses)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOME">Home</SelectItem>
                          <SelectItem value="BUSINESS">Business</SelectItem>
                          <SelectItem value="MAILING">Mailing</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id={`primary-${index}`}
                        checked={address.isPrimary}
                        onCheckedChange={() => setPrimaryAddress(index)}
                      />
                      <Label htmlFor={`primary-${index}`}>Primary Address</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Input
                      value={address.street}
                      onChange={(e) => {
                        const newAddresses = [...addresses]
                        newAddresses[index].street = e.target.value
                        setValue('addresses', newAddresses)
                      }}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={address.city}
                        onChange={(e) => {
                          const newAddresses = [...addresses]
                          newAddresses[index].city = e.target.value
                          setValue('addresses', newAddresses)
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={address.state}
                        onChange={(e) => {
                          const newAddresses = [...addresses]
                          newAddresses[index].state = e.target.value
                          setValue('addresses', newAddresses)
                        }}
                        placeholder="NY"
                        maxLength={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input
                        value={address.zipCode}
                        onChange={(e) => {
                          const newAddresses = [...addresses]
                          newAddresses[index].zipCode = e.target.value
                          setValue('addresses', newAddresses)
                        }}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 2: // Emergency Contacts
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                <p className="text-sm text-gray-600">Add emergency and business contacts for this client</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addContact}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </div>

            {contacts.length === 0 ? (
              <Card className="border-dashed border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts added</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Add emergency contacts and business references for this client
                  </p>
                  <Button
                    type="button"
                    onClick={addContact}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Contact
                  </Button>
                </CardContent>
              </Card>
            ) : (
              contacts.map((contact, index) => (
                <Card key={index} className="border-gray-200/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Contact {index + 1}</span>
                        {contact.isPrimary && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Contact Type</Label>
                        <Select
                          value={contact.type}
                          onValueChange={(value) => {
                            const newContacts = [...contacts]
                            newContacts[index].type = value as any
                            setValue('contacts', newContacts)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMERGENCY">Emergency</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="PERSONAL">Personal</SelectItem>
                            <SelectItem value="LEGAL">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Input
                          value={contact.relationship}
                          onChange={(e) => {
                            const newContacts = [...contacts]
                            newContacts[index].relationship = e.target.value
                            setValue('contacts', newContacts)
                          }}
                          placeholder="Spouse, Business Partner, etc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => {
                          const newContacts = [...contacts]
                          newContacts[index].name = e.target.value
                          setValue('contacts', newContacts)
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => {
                            const newContacts = [...contacts]
                            newContacts[index].email = e.target.value
                            setValue('contacts', newContacts)
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => {
                            const newContacts = [...contacts]
                            newContacts[index].phone = e.target.value
                            setValue('contacts', newContacts)
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={contact.notes}
                        onChange={(e) => {
                          const newContacts = [...contacts]
                          newContacts[index].notes = e.target.value
                          setValue('contacts', newContacts)
                        }}
                        placeholder="Additional notes about this contact..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )

      case 3: // Preferences & Assignment
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="assignedToId">Assigned Attorney *</Label>
              <Select
                value={watch('assignedToId')}
                onValueChange={(value) => setValue('assignedToId', value)}
              >
                <SelectTrigger className={cn(errors.assignedToId && "border-red-500")}>
                  <SelectValue placeholder="Select an attorney" />
                </SelectTrigger>
                <SelectContent>
                  {attorneys.map(attorney => (
                    <SelectItem key={attorney.id} value={attorney.id}>
                      {attorney.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedToId && (
                <p className="text-sm text-red-600">{errors.assignedToId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes about this client..."
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availableTags.filter(tag => !tags.includes(tag)).map(tag => (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addTag(tag)}
                    className="text-xs"
                  >
                    + {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {initialData ? 'Edit Client' : 'New Client Registration'}
              </CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress.current}%</span>
            </div>
            <Progress value={progress.current} className="h-2" />
          </div>
          
          {/* Step Navigation */}
          <div className="flex items-center justify-between pt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2 cursor-pointer transition-colors",
                  index === currentStep && "text-blue-600",
                  completedSteps.includes(index) && "text-green-600",
                  index < currentStep && "text-gray-600"
                )}
                onClick={() => goToStep(index)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                  index === currentStep && "border-blue-600 bg-blue-50",
                  completedSteps.includes(index) && "border-green-600 bg-green-50",
                  index > currentStep && "border-gray-300 bg-gray-50"
                )}>
                  {completedSteps.includes(index) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {initialData ? 'Update Client' : 'Create Client'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}