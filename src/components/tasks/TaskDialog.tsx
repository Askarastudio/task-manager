import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Task, User } from "@/lib/types"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  users: User[]
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

export function TaskDialog({ open, onOpenChange, task, users, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const [projectId, setProjectId] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setAssignedUserIds(task.assignedUserIds)
      setCompleted(task.completed)
      setProjectId(task.projectId)
    } else {
      setTitle("")
      setDescription("")
      setAssignedUserIds([])
      setCompleted(false)
      setProjectId("")
    }
  }, [task, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      projectId,
      title,
      description,
      assignedUserIds,
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
            <Label>Assign ke User</Label>
            <div className="border border-border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada user tersedia</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={assignedUserIds.includes(user.id)}
                      onCheckedChange={() => toggleUserAssignment(user.id)}
                    />
                    <Label
                      htmlFor={`user-${user.id}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {user.name} ({user.email})
                    </Label>
                  </div>
                ))
              )}
            </div>
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
