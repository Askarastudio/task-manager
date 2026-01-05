import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task, User } from "@/lib/types"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  users: User[]
  onSave: (task: Omit<Task, 'taskId' | 'createdAt'>) => void
}

export function TaskDialog({ open, onOpenChange, task, users, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined)
  const [completed, setCompleted] = useState(false)
  const [projectId, setProjectId] = useState<number>(0)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setAssignedTo(task.assignedTo)
      setCompleted(task.completed)
      setProjectId(task.projectId)
    } else {
      setTitle("")
      setDescription("")
      setAssignedTo(undefined)
      setCompleted(false)
      setProjectId(0)
    }
  }, [task, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      projectId,
      title,
      description,
      assignedTo,
      completed,
    })
  }

  const toggleUserAssignment = (userId: string) => {
    setAssignedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Tambah Task Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Judul Task *</Label>
            <Input
              id="task-title"
              placeholder="Contoh: Desain mockup homepage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Deskripsi Task</Label>
            <Textarea
              id="task-description"
              placeholder="Deskripsi detail tentang task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-assignee">Assign ke User</Label>
            <Select 
              value={assignedTo?.toString() || ""} 
              onValueChange={(v) => setAssignedTo(v ? parseInt(v) : undefined)}
            >
              <SelectTrigger id="task-assignee">
                <SelectValue placeholder="Pilih user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tidak ada</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.userId} value={user.userId.toString()}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {task ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
