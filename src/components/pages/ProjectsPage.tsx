import { useState } from "react"
import { Plus, Pencil, Trash, Eye } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProjectWithProgress, Project, Task, User, Expense } from "@/lib/types"
import { formatCurrency, getStatusColor } from "@/lib/utils"
import { ProjectDialog } from "@/components/projects/ProjectDialog"
import { ProjectDetailDialog } from "@/components/projects/ProjectDetailDialog"

interface ProjectsPageProps {
  projects: ProjectWithProgress[]
  tasks: Task[]
  users: User[]
  expenses: Expense[]
  onCreateProject: (project: Omit<Project, 'projectId' | 'createdAt'>) => void
  onUpdateProject: (id: number, project: Omit<Project, 'projectId' | 'createdAt'>) => void
  onDeleteProject: (id: number) => void
  onCreateTask: (task: Omit<Task, 'taskId' | 'createdAt'>) => void
  onUpdateTask: (id: number, task: Omit<Task, 'taskId' | 'createdAt'>) => void
  onDeleteTask: (id: number) => void
  onToggleTask: (id: number) => void
  onCreateExpense: (expense: Omit<Expense, 'expenseId' | 'createdAt'>) => void
  onUpdateExpense: (id: number, expense: Omit<Expense, 'expenseId' | 'createdAt'>) => void
  onDeleteExpense: (id: number) => void
}

export function ProjectsPage({
  projects,
  tasks,
  users,
  expenses,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  onCreateExpense,
  onUpdateExpense,
  onDeleteExpense,
}: ProjectsPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectWithProgress | null>(null)
  const [viewingProject, setViewingProject] = useState<ProjectWithProgress | null>(null)

  const handleCreate = () => {
    setEditingProject(null)
    setDialogOpen(true)
  }

  const handleEdit = (project: ProjectWithProgress) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  const handleView = (project: ProjectWithProgress) => {
    setViewingProject(project)
    setDetailDialogOpen(true)
  }

  const handleSave = (projectData: Omit<Project, 'projectId' | 'createdAt'>) => {
    if (editingProject) {
      onUpdateProject(editingProject.projectId, projectData)
    } else {
      onCreateProject(projectData)
    }
    setDialogOpen(false)
    setEditingProject(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Manajemen Proyek</h2>
          <p className="text-muted-foreground">Kelola semua proyek dan tracking progress</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} weight="bold" />
          Tambah Proyek
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum Ada Proyek</h3>
            <p className="text-muted-foreground mb-6">
              Mulai dengan membuat proyek pertama Anda
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus size={20} weight="bold" />
              Buat Proyek Baru
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.projectId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)} variant="outline">
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Task</span>
                  <span className="font-medium">
                    {project.completedTaskCount} / {project.taskCount}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Anggaran Proyek</p>
                  <p className="font-semibold text-lg">{formatCurrency(project.budget || 0)}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(project)} className="flex-1 gap-1">
                    <Eye size={16} />
                    Detail
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)} className="gap-1">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDeleteProject(project.projectId)} className="gap-1 text-destructive hover:text-destructive">
                    <Trash size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSave={handleSave}
      />

      {viewingProject && (
        <ProjectDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          project={viewingProject}
          tasks={tasks.filter(t => t.projectId === viewingProject.projectId)}
          expenses={expenses.filter(e => e.projectId === viewingProject.projectId)}
          users={users}
          onCreateTask={onCreateTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onToggleTask={onToggleTask}
          onCreateExpense={onCreateExpense}
          onUpdateExpense={onUpdateExpense}
          onDeleteExpense={onDeleteExpense}
        />
      )}
    </div>
  )
}
