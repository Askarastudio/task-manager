import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Project, ProjectWithProgress } from "@/lib/types"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: ProjectWithProgress | null
  onSave: (project: Omit<Project, 'id' | 'createdAt'>) => void
}

export function ProjectDialog({ open, onOpenChange, project, onSave }: ProjectDialogProps) {
  const [name, setName] = useState("")
  const [customer, setCustomer] = useState("")
  const [value, setValue] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (project) {
      setName(project.name)
      setCustomer(project.customer)
      setValue(project.value.toString())
      setDescription(project.description)
    } else {
      setName("")
      setCustomer("")
      setValue("")
      setDescription("")
    }
  }, [project, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      customer,
      value: parseFloat(value) || 0,
      description,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="project-customer">Customer *</Label>
              <Input
                id="project-customer"
                placeholder="Contoh: PT. ABC Indonesia"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-value">Nilai Proyek (IDR) *</Label>
            <Input
              id="project-value"
              type="number"
              placeholder="50000000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
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
