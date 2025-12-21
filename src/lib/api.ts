import { 
  User, 
  Project, 
  Task, 
  Expense, 
  CompanySettings, 
  AuthSession 
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const USE_LOCAL_STORAGE = !API_BASE_URL || import.meta.env.VITE_APP_MODE === 'demo'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private token: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth-token', token)
      } else {
        localStorage.removeItem('auth-token')
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        }
      }

      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: AuthSession }>> {
    const response = await this.request<{ token: string; user: AuthSession }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (response.success && response.data) {
      this.setToken(response.data.token)
    }

    return response
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' })
    this.setToken(null)
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users')
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>('/projects')
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<ApiResponse<Project>> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async updateProject(id: string, projectData: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  async getTasks(projectId?: string): Promise<ApiResponse<Task[]>> {
    const query = projectId ? `?projectId=${projectId}` : ''
    return this.request<Task[]>(`/tasks${query}`)
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<ApiResponse<Task>> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  async getExpenses(projectId?: string): Promise<ApiResponse<Expense[]>> {
    const query = projectId ? `?projectId=${projectId}` : ''
    return this.request<Expense[]>(`/expenses${query}`)
  }

  async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<ApiResponse<Expense>> {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    })
  }

  async updateExpense(id: string, expenseData: Partial<Expense>): Promise<ApiResponse<Expense>> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    })
  }

  async deleteExpense(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/expenses/${id}`, {
      method: 'DELETE',
    })
  }

  async getCompanySettings(): Promise<ApiResponse<CompanySettings>> {
    return this.request<CompanySettings>('/company/settings')
  }

  async updateCompanySettings(settings: CompanySettings): Promise<ApiResponse<CompanySettings>> {
    return this.request<CompanySettings>('/company/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }
}

export const apiClient = new ApiClient()
export const isUsingLocalStorage = USE_LOCAL_STORAGE
