import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Project, Task, Expense, User, ProjectWithProgress } from "@/lib/types"
import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3
} from "lucide-react"

interface ReportsPageProps {
  projects: ProjectWithProgress[]
  tasks: Task[]
  expenses: Expense[]
  users: User[]
}

export function ReportsPage({ projects, tasks, expenses, users }: ReportsPageProps) {
  const [reportType, setReportType] = useState<"overview" | "projects" | "tasks" | "expenses">("overview")
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "month" | "quarter" | "year">("month")

  // Calculate date range based on period
  const getDateRange = () => {
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    
    switch (selectedPeriod) {
      case "month":
        return now - (30 * day)
      case "quarter":
        return now - (90 * day)
      case "year":
        return now - (365 * day)
      default:
        return 0
    }
  }

  const dateThreshold = getDateRange()

  // Filter data by period
  const filteredProjects = projects.filter(p => p.createdAt >= dateThreshold)
  const filteredTasks = tasks.filter(t => t.createdAt >= dateThreshold)
  const filteredExpenses = expenses.filter(e => e.date >= dateThreshold)

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProjects = filteredProjects.length
    const activeProjects = filteredProjects.filter(p => p.status === "in-progress").length
    const completedProjects = filteredProjects.filter(p => p.status === "completed").length
    
    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter(t => t.completed).length
    const pendingTasks = totalTasks - completedTasks
    
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
    
    const averageProgress = filteredProjects.length > 0
      ? filteredProjects.reduce((sum, p) => sum + p.progress, 0) / filteredProjects.length
      : 0

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      totalExpenses,
      totalBudget,
      averageProgress,
      budgetUtilization: totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0
    }
  }, [filteredProjects, filteredTasks, filteredExpenses])

  // Project summary by status
  const projectsByStatus = useMemo(() => {
    const summary = { pending: 0, "in-progress": 0, completed: 0, onhold: 0 }
    filteredProjects.forEach(p => {
      summary[p.status as keyof typeof summary]++
    })
    return summary
  }, [filteredProjects])

  // Expenses by project
  const expensesByProject = useMemo(() => {
    const map = new Map<number, number>()
    filteredExpenses.forEach(e => {
      const current = map.get(e.projectId) || 0
      map.set(e.projectId, current + e.amount)
    })
    return Array.from(map.entries())
      .map(([projectId, amount]) => ({
        project: filteredProjects.find(p => p.projectId === projectId),
        amount
      }))
      .filter(item => item.project)
      .sort((a, b) => b.amount - a.amount)
  }, [filteredExpenses, filteredProjects])

  // Task completion by user
  const tasksByUser = useMemo(() => {
    const map = new Map<number, { total: number, completed: number }>()
    filteredTasks.forEach(t => {
      if (!t.assignedTo) return
      const current = map.get(t.assignedTo) || { total: 0, completed: 0 }
      current.total++
      if (t.completed) current.completed++
      map.set(t.assignedTo, current)
    })
    return Array.from(map.entries())
      .map(([userId, stats]) => ({
        user: users.find(u => u.userId === userId),
        ...stats,
        completionRate: (stats.completed / stats.total) * 100
      }))
      .filter(item => item.user)
      .sort((a, b) => b.completionRate - a.completionRate)
  }, [filteredTasks, users])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleExportReport = () => {
    // Simple CSV export
    let csv = ""
    const filename = `laporan_${reportType}_${selectedPeriod}_${Date.now()}.csv`

    switch (reportType) {
      case "projects":
        csv = "Nama Proyek,Status,Progress,Anggaran,Total Pengeluaran,Tanggal Mulai\n"
        filteredProjects.forEach(p => {
          const projectExpenses = filteredExpenses
            .filter(e => e.projectId === p.projectId)
            .reduce((sum, e) => sum + e.amount, 0)
          csv += `"${p.name}","${p.status}","${p.progress}%","${p.budget || 0}","${projectExpenses}","${formatDate(p.createdAt)}"\n`
        })
        break
      
      case "tasks":
        csv = "Judul Tugas,Proyek,Status,Assignee,Tanggal Dibuat\n"
        filteredTasks.forEach(t => {
          const project = projects.find(p => p.projectId === t.projectId)
          const user = users.find(u => u.userId === t.assignedTo)
          csv += `"${t.title}","${project?.name || 'N/A'}","${t.completed ? 'Selesai' : 'Belum Selesai'}","${user?.name || 'N/A'}","${formatDate(t.createdAt)}"\n`
        })
        break
      
      case "expenses":
        csv = "Deskripsi,Proyek,Jumlah,Tanggal\n"
        filteredExpenses.forEach(e => {
          const project = projects.find(p => p.projectId === e.projectId)
          csv += `"${e.description}","${project?.name || 'N/A'}","${e.amount}","${formatDate(e.date)}"\n`
        })
        break
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Laporan</h1>
            <p className="text-muted-foreground mt-1">
              Analisis dan ringkasan kinerja proyek
            </p>
          </div>
          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Ekspor Laporan
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Jenis Laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Ringkasan</SelectItem>
              <SelectItem value="projects">Proyek</SelectItem>
              <SelectItem value="tasks">Tugas</SelectItem>
              <SelectItem value="expenses">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={(v: any) => setSelectedPeriod(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Waktu</SelectItem>
              <SelectItem value="month">30 Hari Terakhir</SelectItem>
              <SelectItem value="quarter">3 Bulan Terakhir</SelectItem>
              <SelectItem value="year">1 Tahun Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        {reportType === "overview" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proyek</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeProjects} aktif, {stats.completedProjects} selesai
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress Rata-rata</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageProgress.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Dari semua proyek aktif
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedTasks} selesai, {stats.pendingTasks} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
                  <p className="text-xs text-muted-foreground">
                    Dari anggaran {formatCurrency(stats.totalBudget)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Status Proyek</CardTitle>
                <CardDescription>Ringkasan proyek berdasarkan status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      Pending
                    </span>
                    <Badge variant="secondary">{projectsByStatus.pending}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      In Progress
                    </span>
                    <Badge variant="secondary">{projectsByStatus["in-progress"]}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Completed
                    </span>
                    <Badge variant="secondary">{projectsByStatus.completed}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      On Hold
                    </span>
                    <Badge variant="secondary">{projectsByStatus.onhold}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Expenses by Project */}
            <Card>
              <CardHeader>
                <CardTitle>Pengeluaran Terbesar per Proyek</CardTitle>
                <CardDescription>Top 5 proyek dengan pengeluaran tertinggi</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proyek</TableHead>
                      <TableHead>Anggaran</TableHead>
                      <TableHead>Pengeluaran</TableHead>
                      <TableHead>Utilisasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expensesByProject.slice(0, 5).map((item, idx) => {
                      const utilization = item.project?.budget 
                        ? (item.amount / item.project.budget) * 100 
                        : 0
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.project?.name}</TableCell>
                          <TableCell>{formatCurrency(item.project?.budget || 0)}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>
                            <Badge variant={utilization > 100 ? "destructive" : "default"}>
                              {utilization.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* User Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Kinerja Tim</CardTitle>
                <CardDescription>Tingkat penyelesaian tugas per anggota tim</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Total Tugas</TableHead>
                      <TableHead>Selesai</TableHead>
                      <TableHead>Tingkat Penyelesaian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasksByUser.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.user?.name}</TableCell>
                        <TableCell>{item.total}</TableCell>
                        <TableCell>{item.completed}</TableCell>
                        <TableCell>
                          <Badge variant={item.completionRate >= 80 ? "default" : "secondary"}>
                            {item.completionRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {/* Projects Report */}
        {reportType === "projects" && (
          <Card>
            <CardHeader>
              <CardTitle>Laporan Proyek</CardTitle>
              <CardDescription>Daftar lengkap semua proyek</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Proyek</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead>Pengeluaran</TableHead>
                    <TableHead>Tanggal Mulai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const projectExpenses = filteredExpenses
                      .filter(e => e.projectId === project.projectId)
                      .reduce((sum, e) => sum + e.amount, 0)
                    
                    return (
                      <TableRow key={project.projectId}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge>{project.status}</Badge>
                        </TableCell>
                        <TableCell>{project.progress}%</TableCell>
                        <TableCell>{formatCurrency(project.budget || 0)}</TableCell>
                        <TableCell>{formatCurrency(projectExpenses)}</TableCell>
                        <TableCell>{formatDate(project.createdAt)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Tasks Report */}
        {reportType === "tasks" && (
          <Card>
            <CardHeader>
              <CardTitle>Laporan Tugas</CardTitle>
              <CardDescription>Daftar semua tugas dan statusnya</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Proyek</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => {
                    const project = projects.find(p => p.projectId === task.projectId)
                    const user = users.find(u => u.userId === task.assignedTo)
                    
                    return (
                      <TableRow key={task.taskId}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{project?.name || 'N/A'}</TableCell>
                        <TableCell>{user?.name || 'Unassigned'}</TableCell>
                        <TableCell>
                          <Badge variant={task.completed ? "default" : "secondary"}>
                            {task.completed ? 'Selesai' : 'Belum Selesai'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(task.createdAt)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Expenses Report */}
        {reportType === "expenses" && (
          <Card>
            <CardHeader>
              <CardTitle>Laporan Pengeluaran</CardTitle>
              <CardDescription>Detail semua pengeluaran proyek</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Proyek</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => {
                    const project = projects.find(p => p.projectId === expense.projectId)
                    
                    return (
                      <TableRow key={expense.expenseId}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>{project?.name || 'N/A'}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell>{formatCurrency(stats.totalExpenses)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
