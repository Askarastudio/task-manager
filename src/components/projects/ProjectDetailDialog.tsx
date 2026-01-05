import { useState } from "react"
import { Plus, Trash, UserCircle, CurrencyCircleDollar } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { ProjectWithProgress, Task, User, Expense } from "@/lib/types"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { TaskDialog } from "@/components/tasks/TaskDialog"
import { ExpenseDialog } from "@/components/projects/ExpenseDialog"
import { Separator } from "@/components/ui/separator"

interface ProjectDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectWithProgress
  tasks: Task[]
  expenses: Expense[]
  users: User[]
  onCreateTask: (task: Omit<Task, 'taskId' | 'createdAt'>) => void
  onUpdateTask: (id: number, task: Omit<Task, 'taskId' | 'createdAt'>) => void
  onDeleteTask: (id: number) => void
  onToggleTask: (id: number) => void
  onCreateExpense: (expense: Omit<Expense, 'expenseId' | 'createdAt'>) => void
  onUpdateExpense: (id: number, expense: Omit<Expense, 'expenseId' | 'createdAt'>) => void
  onDeleteExpense: (id: number) => void
}

export function ProjectDetailDialog({
  open,
  onOpenChange,
  project,
  tasks,
  expenses,
  users,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  onCreateExpense,
  onUpdateExpense,
  onDeleteExpense,
}: ProjectDetailDialogProps) {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const handleCreateTask = () => {
    setEditingTask(null)
    setTaskDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskDialogOpen(true)
  }

  const handleSaveTask = (taskData: Omit<Task, 'taskId' | 'createdAt'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.taskId, taskData)
    } else {
      onCreateTask({ ...taskData, projectId: project.projectId })
    }
    setTaskDialogOpen(false)
    setEditingTask(null)
  }

  const handleCreateExpense = () => {
    setEditingExpense(null)
    setExpenseDialogOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setExpenseDialogOpen(true)
  }

  const handleSaveExpense = (expenseData: Omit<Expense, 'expenseId' | 'createdAt'>) => {
    if (editingExpense) {
      onUpdateExpense(editingExpense.expenseId, expenseData)
    } else {
      onCreateExpense({ ...expenseData, projectId: project.projectId })
    }
    setExpenseDialogOpen(false)
    setEditingExpense(null)
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const expenseCategories = {
    'petty-cash': 'Petty Cash',
    'operational': 'Operasional',
    'material': 'Material',
    'labor': 'Tenaga Kerja',
    'other': 'Lainnya'
  }

  const getUserNames = (userId?: number) => {
    if (!userId) return 'Tidak ada'
    return users.find(u => u.userId === userId)?.name || 'Tidak ada'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{project.name}</DialogTitle>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <Badge className={getStatusColor(project.status)} variant="outline">
              {project.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="expenses">Pengeluaran ({expenses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Anggaran Proyek</p>
                  <p className="text-2xl font-bold">{formatCurrency(project.budget || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sisa Budget</p>
                  <p className={`text-2xl font-bold ${(project.budget || 0) - totalExpenses < 0 ? 'text-destructive' : 'text-success'}`}>
                    {formatCurrency((project.budget || 0) - totalExpenses)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tanggal Dibuat</p>
                  <p className="font-medium">{formatDate(project.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Progress Proyek</p>
                    <p className="text-xl font-bold">{project.progress}%</p>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Task</p>
                  <p className="font-medium">
                    {project.completedTaskCount} selesai dari {project.taskCount} total
                  </p>
                </div>
              </div>
            </div>

            {project.description && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Deskripsi</p>
                  <p className="text-foreground whitespace-pre-wrap">{project.description}</p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Kelola task untuk proyek ini
              </p>
              <Button onClick={handleCreateTask} size="sm" className="gap-2">
                <Plus size={18} weight="bold" />
                Tambah Task
              </Button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">Belum ada task</p>
                <Button onClick={handleCreateTask} variant="outline" className="gap-2">
                  <Plus size={18} />
                  Tambah Task Pertama
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.taskId}
                    className={`flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group ${
                      task.completed ? 'bg-muted/20' : ''
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onToggleTask(task.taskId)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </p>
                        {task.completed && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                            Selesai
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className={`text-sm text-muted-foreground mb-2 line-clamp-2 ${
                          task.completed ? 'line-through opacity-50' : ''
                        }`}>
                          {task.description}
                        </p>
                      )}
                      {task.assignedTo && (
                        <div className="flex items-center gap-2 text-sm">
                          <UserCircle size={16} className="text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {getUserNames(task.assignedTo)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTask(task.taskId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Kelola pengeluaran untuk proyek ini
                </p>
                <p className="text-lg font-bold mt-1">
                  Total: {formatCurrency(totalExpenses)}
                </p>
              </div>
              <Button onClick={handleCreateExpense} size="sm" className="gap-2">
                <Plus size={18} weight="bold" />
                Tambah Pengeluaran
              </Button>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <CurrencyCircleDollar size={48} className="mx-auto text-muted-foreground mb-3" weight="thin" />
                <p className="text-muted-foreground mb-4">Belum ada pengeluaran</p>
                <Button onClick={handleCreateExpense} variant="outline" className="gap-2">
                  <Plus size={18} />
                  Tambah Pengeluaran Pertama
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div
                    key={expense.expenseId}
                    className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-lg font-bold text-destructive ml-4">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {expenseCategories[expense.category]}
                        </Badge>
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditExpense(expense)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteExpense(expense.expenseId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          task={editingTask}
          users={users}
          onSave={handleSaveTask}
        />

        <ExpenseDialog
          open={expenseDialogOpen}
          onOpenChange={setExpenseDialogOpen}
          expense={editingExpense}
          onSave={handleSaveExpense}
        />
      </DialogContent>
    </Dialog>
  )
}
