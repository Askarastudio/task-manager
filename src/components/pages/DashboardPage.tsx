import { FolderOpen, ListChecks, Users, TrendUp, ChartBar } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectWithProgress, Task, User, Expense } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DashboardPageProps {
  projects: ProjectWithProgress[]
  tasks: Task[]
  users: User[]
  expenses: Expense[]
}

export function DashboardPage({ projects, tasks, users, expenses }: DashboardPageProps) {
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'in-progress').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalTasks = tasks.length
  const totalUsers = users.length

  const totalValue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0)
  const valuePending = projects.filter(p => p.status === 'pending').reduce((sum, p) => sum + (Number(p.budget) || 0), 0)
  const valueInProgress = projects.filter(p => p.status === 'in-progress').reduce((sum, p) => sum + (Number(p.budget) || 0), 0)
  const valueCompleted = projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + (Number(p.budget) || 0), 0)

  const chartData = [
    {
      name: 'Semua',
      value: totalValue,
      fill: '#5b7deb'
    },
    {
      name: 'Pending',
      value: valuePending,
      fill: '#94a3b8'
    },
    {
      name: 'In Progress',
      value: valueInProgress,
      fill: '#3b82f6'
    },
    {
      name: 'Completed',
      value: valueCompleted,
      fill: '#10b981'
    },
  ]

  const stats = [
    {
      title: 'Total Proyek',
      value: totalProjects,
      icon: FolderOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Proyek Aktif',
      value: activeProjects,
      icon: TrendUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Proyek Selesai',
      value: completedProjects,
      icon: FolderOpen,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Task',
      value: totalTasks,
      icon: ListChecks,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Tim',
      value: totalUsers,
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Ringkasan aktivitas dan progress proyek</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon size={20} weight="fill" className={stat.color} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar size={24} weight="fill" className="text-primary" />
            Grafik Total Nilai Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 14 }}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 14 }}
                  tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">Total Semua</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(totalValue)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-lg font-bold text-muted-foreground">{formatCurrency(valuePending)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-info/10">
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-lg font-bold text-info">{formatCurrency(valueInProgress)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-lg font-bold text-success">{formatCurrency(valueCompleted)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proyek Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada proyek. Mulai dengan membuat proyek baru.
              </p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.projectId}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{project.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold">{project.progress}%</p>
                        <p className="text-xs text-muted-foreground">{project.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Proyek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-semibold">{projects.filter(p => p.status === 'pending').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-info"></div>
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-semibold">{activeProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-semibold">{completedProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
