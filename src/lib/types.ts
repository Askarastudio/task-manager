export interface User {
  id: string
  name: string
  email: string
  role: string
  password: string
  createdAt: number
}

export interface Project {
  id: string
  name: string
  customer: string
  value: number
  description: string
  createdAt: number
}

export interface Expense {
  id: string
  projectId: string
  description: string
  amount: number
  category: 'petty-cash' | 'operational' | 'material' | 'labor' | 'other'
  date: number
  createdAt: number
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  assignedUserIds: string[]
  completed: boolean
  createdAt: number
}

export interface CompanySettings {
  name: string
  logo?: string
  address: string
  phone: string
  email: string
  letterhead?: string
}

export interface AuthSession {
  userId: string
  email: string
  name: string
  loginAt: number
}

export type ProjectStatus = 'Perencanaan' | 'On Progress' | 'Selesai'

export interface ProjectWithProgress extends Project {
  progress: number
  status: ProjectStatus
  taskCount: number
  completedTaskCount: number
}
