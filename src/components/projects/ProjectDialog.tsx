import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Project, ProjectWithProgress } from "@/lib/types"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: ProjectWithProgress | null
  onSave: (project: Omit<Project, 'projectId' | 'createdAt'>) => void
}

export function ProjectDialog({ open, onOpenChange, project, onSave }: ProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed' | 'onhold'>('pending')

  useEffect(() => {
    if (project) {
      setName(project.name)
      setDescription(project.description)
      setBudget(project.budget?.toString() || "0")
      setStatus(project.status)
    } else {
      setName("")
      setDescription("")
      setBudget("")
      setStatus('pending')
    }
  }, [project, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      budget: parseFloat(budget) || 0,
      status,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Nama Proyek *</Label>
            <Input
              id="project-name"
              placeholder="Contoh: Website Perusahaan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-budget">Anggaran (IDR) *</Label>
              <Input
                id="project-budget"
                type="number"
                placeholder="50000000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-status">Status *</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger id="project-status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="onhold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-description">Deskripsi Proyek</Label>
            <Textarea
              id="project-description"
              placeholder="Deskripsi detail tentang proyek..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {project ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
