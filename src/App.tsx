import { useState, useMemo } from "react"
import { useKV } from "@github/spark/hooks"
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
import { useDemoData } from "@/hooks/use-demo-data"
import { LoginPage } from "@/components/auth/LoginPage"
import { Navbar } from "@/components/layout/Navbar"
import { DashboardPage } from "@/components/pages/DashboardPage"
import { ProjectsPage } from "@/components/pages/ProjectsPage"
import { UsersPage } from "@/components/pages/UsersPage"
import { CompanyPage } from "@/components/pages/CompanyPage"

function App() {
  const [session, setSession] = useKV<AuthSession | null>("auth-session", null)
  const [users, setUsers] = useKV<User[]>("users", [])
  const [projects, setProjects] = useKV<Project[]>("projects", [])
  const [tasks, setTasks] = useKV<Task[]>("tasks", [])
  const [expenses, setExpenses] = useKV<Expense[]>("expenses", [])
  const [companySettings, setCompanySettings] = useKV<CompanySettings>("company-settings", {
    name: "IkuHub Proyeksi",
    address: "",
    phone: "",
    email: "",
  })
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [loginError, setLoginError] = useState<string | null>(null)

  const DEFAULT_PASSWORD = "Ikuhub@2025"

  useDemoData(users || [], projects || [], tasks || [], setUsers, setProjects, setTasks)

  const projectsWithProgress: ProjectWithProgress[] = useMemo(() => {
    return (projects || []).map(project => 
      calculateProjectProgress(project, tasks || [])
    ).sort((a, b) => b.createdAt - a.createdAt)
  }, [projects, tasks])

  const handleLogin = (email: string, password: string) => {
    if (password !== DEFAULT_PASSWORD) {
      toast.error("Password salah. Gunakan password demo: Ikuhub@2025")
      return
    }
    
    const newSession: AuthSession = {
      userId: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      loginAt: Date.now(),
    }
    setSession(newSession)
    toast.success(`Selamat datang, ${newSession.name}!`)
  }

  const handleLogout = () => {
    setSession(null)
    setCurrentPage("dashboard")
    toast.info("Anda telah keluar")
  }

  const handleCreateUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      password: userData.password || DEFAULT_PASSWORD,
      createdAt: Date.now(),
    }
    setUsers((current) => [newUser, ...(current || [])])
    toast.success("User berhasil ditambahkan")
  }

  const handleUpdateUser = (id: string, userData: Omit<User, 'id' | 'createdAt'>) => {
    setUsers((current) =>
      (current || []).map((user) =>
        user.id === id ? { ...user, ...userData } : user
      )
    )
    toast.success("User berhasil diperbarui")
  }

  const handleDeleteUser = (id: string) => {
    setUsers((current) => (current || []).filter((user) => user.id !== id))
    toast.info("User berhasil dihapus")
  }

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...projectData,
      createdAt: Date.now(),
    }
    setProjects((current) => [newProject, ...(current || [])])
    toast.success("Proyek berhasil ditambahkan")
  }

  const handleUpdateProject = (id: string, projectData: Omit<Project, 'id' | 'createdAt'>) => {
    setProjects((current) =>
      (current || []).map((project) =>
        project.id === id ? { ...project, ...projectData } : project
      )
    )
    toast.success("Proyek berhasil diperbarui")
  }

  const handleDeleteProject = (id: string) => {
    setProjects((current) => (current || []).filter((project) => project.id !== id))
    setTasks((current) => (current || []).filter((task) => task.projectId !== id))
    toast.info("Proyek dan semua task terkait berhasil dihapus")
  }

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      createdAt: Date.now(),
    }
    setTasks((current) => [newTask, ...(current || [])])
    toast.success("Task berhasil ditambahkan")
  }

  const handleUpdateTask = (id: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks((current) =>
      (current || []).map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      )
    )
    toast.success("Task berhasil diperbarui")
  }

  const handleDeleteTask = (id: string) => {
    setTasks((current) => (current || []).filter((task) => task.id !== id))
    toast.info("Task berhasil dihapus")
  }

  const handleToggleTask = (id: string) => {
    setTasks((current) =>
      (current || []).map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleSaveCompanySettings = (settings: CompanySettings) => {
    setCompanySettings(settings)
  }

  const handleCreateExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...expenseData,
      createdAt: Date.now(),
    }
    setExpenses((current) => [newExpense, ...(current || [])])
    toast.success("Pengeluaran berhasil ditambahkan")
  }

  const handleUpdateExpense = (id: string, expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses((current) =>
      (current || []).map((expense) =>
        expense.id === id ? { ...expense, ...expenseData } : expense
      )
    )
    toast.success("Pengeluaran berhasil diperbarui")
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses((current) => (current || []).filter((expense) => expense.id !== id))
    toast.info("Pengeluaran berhasil dihapus")
  }

  if (!session) {
    return (
      <>
        <Toaster position="top-center" />
        <LoginPage onLogin={handleLogin} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        companyLogo={companySettings?.logo}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {currentPage === 'dashboard' && (
          <DashboardPage
            projects={projectsWithProgress}
            totalUsers={(users || []).length}
            onNavigate={setCurrentPage}
          />
        )}
        
        {currentPage === 'projects' && (
          <ProjectsPage
            projects={projectsWithProgress}
            tasks={tasks || []}
            users={users || []}
            expenses={expenses || []}
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
        
        {currentPage === 'users' && (
          <UsersPage
            users={users || []}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
        
        {currentPage === 'company' && (
          <CompanyPage
            settings={companySettings || {
              name: "IkuHub Proyeksi",
              address: "",
              phone: "",
              email: "",
            }}
            onSave={handleSaveCompanySettings}
          />
        )}
      </main>
    </div>
  )
}

export default App
