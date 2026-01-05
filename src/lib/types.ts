export interface User {
  userId: number
  name: string
  email: string
  role: string
  password?: string
  createdAt: number
}

export interface Project {
  projectId: number
  name: string
  description: string
  budget?: number
  status: 'pending' | 'in-progress' | 'completed' | 'onhold'
  createdAt: number
}

export interface Expense {
  expenseId: number
  projectId: number
  description: string
  amount: number
  category?: 'petty-cash' | 'operational' | 'material' | 'labor' | 'other'
  date: number
  createdAt: number
}

export interface Task {
  taskId: number
  projectId: number
  title: string
  description: string
  assignedTo?: number
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
  userId: number
  email: string
  name: string
  loginAt: number
}

export type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'onhold'

export interface ProjectWithProgress extends Project {
  progress: number
  status: ProjectStatus
  taskCount: number
  completedTaskCount: number
}

export interface ReportStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  pendingProjects: number
  onholdProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  totalExpenses: number
  totalBudget: number
  period: string
  generatedAt: number
}

export interface ReportData {
  stats: ReportStats
  projects: ProjectWithProgress[]
  tasks: Task[]
  expenses: Expense[]
  users: User[]
  expensesByProject: Record<number, number>
  tasksByUser: Record<number, { total: number, completed: number }>
}
