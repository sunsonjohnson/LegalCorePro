import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Case {
  id: string
  title: string
  status: string
  priority: string
  clientName: string
  assignedTo: string
}

interface Client {
  id: string
  name: string
  email: string
  company?: string
}

interface AppStore {
  cases: Case[]
  clients: Client[]
  selectedCase: Case | null
  sidebarOpen: boolean
  setCases: (cases: Case[]) => void
  setClients: (clients: Client[]) => void
  setSelectedCase: (selectedCase: Case | null) => void
  setSidebarOpen: (open: boolean) => void
}

export const useStore = create<AppStore>()(
  devtools(
    (set) => ({
      cases: [],
      clients: [],
      selectedCase: null,
      sidebarOpen: true,
      setCases: (cases) => set({ cases }),
      setClients: (clients) => set({ clients }),
      setSelectedCase: (selectedCase) => set({ selectedCase }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'legalcore-store',
    }
  )
)