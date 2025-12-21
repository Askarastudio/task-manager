import { useState, useEffect, useMemo } from "react"
import { Toaster, toast } from "sonner"
import { 
  User, 
  Project, 
  Task, 
  Expense,
  CompanySettings, 
  AuthSession,
  ProjectWithProgress 
} from "@/lib/types"
import { calculateProjectProgress } from "@/lib/utils"
import { apiClient } from "@/lib/api"
import { LoginPage } from "@/components/auth/LoginPage"
import { Navbar } from "@/components/layout/Navbar"
import { DashboardPage } from "@/components/pages/DashboardPage"
import { ProjectsPage } from "@/components/pages/ProjectsPage"
import { UsersPage } from "@/components/pages/UsersPage"
import { CompanyPage } from "@/components/pages/CompanyPage"

function App() {
  // Session management
  const [session, setSession] = useState<AuthSession | null>(() => {
    const token = localStorage.getItem('auth-token')
    const sessionData = localStorage.getItem('auth-session')
    if (token && sessionData) {
      apiClient.setToken(token)
      return JSON.parse(sessionData)
    }
    return null
  })

  // Data states
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: "IkuHub Proyeksi",
    address: "",
    phone: "",
    email: "",
  })

  const [currentPage, setCurrentPage] = useState("dashboard")
  const [loading, setLoading] = useState(false)

  // Fetch all data when logged in
  useEffect(() => {
    if (!session) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [usersRes, projectsRes, tasksRes, expensesRes, settingsRes] = await Promise.all([
          apiClient.getUsers(),
          apiClient.getProjects(),
          apiClient.getTasks(),
          apiClient.getExpenses(),
          apiClient.getCompanySettings()
        ])

        if (usersRes.success && usersRes.data) setUsers(usersRes.data)
        if (projectsRes.success && projectsRes.data) setProjects(projectsRes.data)
        if (tasksRes.success && tasksRes.data) setTasks(tasksRes.data)
        if (expensesRes.success && expensesRes.data) setExpenses(expensesRes.data)
        if (settingsRes.success && settingsRes.data) setCompanySettings(settingsRes.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Gagal memuat data dari server')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const projectsWithProgress: ProjectWithProgress[] = useMemo(() => {
    return projects.map(project => 
      calculateProjectProgress(project, tasks)
    ).sort((a, b) => b.createdAt - a.createdAt)
  }, [projects, tasks])

  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await apiClient.login(email, password)
      
      if (response.success && response.data) {
        const { token, user } = response.data
        const newSession: AuthSession = {
          userId: user.userId,
          email: user.email,
          name: user.name,
          loginAt: Date.now(),
        }
        
        apiClient.setToken(token)
        localStorage.setItem('auth-session', JSON.stringify(newSession))
        setSession(newSession)
        toast.success(`Selamat datang, ${user.name}!`)
      } else {
        toast.error(response.error || "Login gagal")
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    apiClient.setToken(null)
    localStorage.removeItem('auth-session')
    setSession(null)
    setUsers([])
    setProjects([])
    setTasks([])
    setExpenses([])
    setCurrentPage("dashboard")
    toast.info("Anda telah keluar")
  }

  // User CRUD handlers
  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.createUser(userData)
      if (response.success && response.data) {
        setUsers((current) => [response.data!, ...current])
        toast.success("User berhasil ditambahkan")
      } else {
        toast.error(response.error || "Gagal menambahkan user")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleUpdateUser = async (id: string, userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.updateUser(id, userData)
      if (response.success && response.data) {
        setUsers((current) =>
          current.map((user) => user.id === id ? response.data! : user)
        )
        toast.success("User berhasil diperbarui")
      } else {
        toast.error(response.error || "Gagal memperbarui user")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await apiClient.deleteUser(id)
      if (response.success) {
        setUsers((current) => current.filter((user) => user.id !== id))
        toast.info("User berhasil dihapus")
      } else {
        toast.error(response.error || "Gagal menghapus user")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  // Project CRUD handlers
  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.createProject(projectData)
      if (response.success && response.data) {
        setProjects((current) => [response.data!, ...current])
        toast.success("Proyek berhasil ditambahkan")
      } else {
        toast.error(response.error || "Gagal menambahkan proyek")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleUpdateProject = async (id: string, projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.updateProject(id, projectData)
      if (response.success && response.data) {
        setProjects((current) =>
          current.map((project) => project.id === id ? response.data! : project)
        )
        toast.success("Proyek berhasil diperbarui")
      } else {
        toast.error(response.error || "Gagal memperbarui proyek")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await apiClient.deleteProject(id)
      if (response.success) {
        setProjects((current) => current.filter((project) => project.id !== id))
        setTasks((current) => current.filter((task) => task.projectId !== id))
        setExpenses((current) => current.filter((expense) => expense.projectId !== id))
        toast.info("Proyek dan data terkait berhasil dihapus")
      } else {
        toast.error(response.error || "Gagal menghapus proyek")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  // Task CRUD handlers
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.createTask(taskData)
      if (response.success && response.data) {
        setTasks((current) => [response.data!, ...current])
        toast.success("Task berhasil ditambahkan")
      } else {
        toast.error(response.error || "Gagal menambahkan task")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleUpdateTask = async (id: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.updateTask(id, taskData)
      if (response.success && response.data) {
        setTasks((current) =>
          current.map((task) => task.id === id ? response.data! : task)
        )
        toast.success("Task berhasil diperbarui")
      } else {
        toast.error(response.error || "Gagal memperbarui task")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await apiClient.deleteTask(id)
      if (response.success) {
        setTasks((current) => current.filter((task) => task.id !== id))
        toast.info("Task berhasil dihapus")
      } else {
        toast.error(response.error || "Gagal menghapus task")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    // Optimistic update - update UI immediately
    const updatedTask = { ...task, completed: !task.completed }
    setTasks((current) =>
      current.map((t) => t.id === id ? updatedTask : t)
    )

    try {
      const response = await apiClient.updateTask(id, {
        ...task,
        completed: !task.completed
      })
      
      if (response.success && response.data) {
        // Confirm with server response
        setTasks((current) =>
          current.map((t) => t.id === id ? response.data! : t)
        )
        toast.success(response.data.completed ? "Task selesai!" : "Task dibuka kembali")
      } else {
        // Revert on failure
        setTasks((current) =>
          current.map((t) => t.id === id ? task : t)
        )
        toast.error(response.error || "Gagal mengubah status task")
      }
    } catch (error) {
      // Revert on error
      setTasks((current) =>
        current.map((t) => t.id === id ? task : t)
      )
      toast.error("Terjadi kesalahan")
    }
  }

  // Expense CRUD handlers
  const handleCreateExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.createExpense(expenseData)
      if (response.success && response.data) {
        setExpenses((current) => [response.data!, ...current])
        toast.success("Pengeluaran berhasil ditambahkan")
      } else {
        toast.error(response.error || "Gagal menambahkan pengeluaran")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleUpdateExpense = async (id: string, expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.updateExpense(id, expenseData)
      if (response.success && response.data) {
        setExpenses((current) =>
          current.map((expense) => expense.id === id ? response.data! : expense)
        )
        toast.success("Pengeluaran berhasil diperbarui")
      } else {
        toast.error(response.error || "Gagal memperbarui pengeluaran")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      const response = await apiClient.deleteExpense(id)
      if (response.success) {
        setExpenses((current) => current.filter((expense) => expense.id !== id))
        toast.info("Pengeluaran berhasil dihapus")
      } else {
        toast.error(response.error || "Gagal menghapus pengeluaran")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  // Company settings handler
  const handleUpdateCompanySettings = async (settings: CompanySettings) => {
    try {
      const response = await apiClient.updateCompanySettings(settings)
      if (response.success && response.data) {
        setCompanySettings(response.data)
        toast.success("Pengaturan perusahaan berhasil diperbarui")
      } else {
        toast.error(response.error || "Gagal memperbarui pengaturan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  if (!session) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        session={session}
        companyName={companySettings.name}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-6">
        {loading && currentPage === "dashboard" ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Memuat data...</div>
          </div>
        ) : (
          <>
            {currentPage === "dashboard" && (
              <DashboardPage
                projects={projectsWithProgress}
                tasks={tasks}
                users={users}
                expenses={expenses}
              />
            )}
            
            {currentPage === "projects" && (
              <ProjectsPage
                projects={projectsWithProgress}
                tasks={tasks}
                users={users}
                expenses={expenses}
                onCreateProject={handleCreateProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onToggleTask={handleToggleTask}
                onCreateExpense={handleCreateExpense}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            )}
            
            {currentPage === "users" && (
              <UsersPage
                users={users}
                onCreateUser={handleCreateUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
              />
            )}
            
            {currentPage === "company" && (
              <CompanyPage
                settings={companySettings}
                onUpdateSettings={handleUpdateCompanySettings}
              />
            )}
          </>
        )}
      </main>
      
      <Toaster position="top-right" />
    </div>
  )
}

export default App
