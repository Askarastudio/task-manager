import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "@/lib/types"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (user: Omit<User, 'userId' | 'createdAt'>) => void
}

const DEFAULT_PASSWORD = "Ikuhub@2025"

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [password, setPassword] = useState("")
  const [changePassword, setChangePassword] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
      setPassword("")
      setChangePassword(false)
    } else {
      setName("")
      setEmail("")
      setRole("")
      setPassword(DEFAULT_PASSWORD)
      setChangePassword(false)
    }
  }, [user, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const userData: Omit<User, 'userId' | 'createdAt'> = {
      name,
      email,
      role,
      password: user && !changePassword ? user.password : (password || DEFAULT_PASSWORD),
    }
    
    onSave(userData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Nama Lengkap *</Label>
            <Input
              id="user-name"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-email">Email *</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="budi@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-role">Jabatan/Role *</Label>
            <Input
              id="user-role"
              placeholder="Contoh: Developer, Designer, Project Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>
          
          {user ? (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="change-password"
                  checked={changePassword}
                  onCheckedChange={(checked) => setChangePassword(checked === true)}
                />
                <Label htmlFor="change-password" className="text-sm cursor-pointer">
                  Ganti Password
                </Label>
              </div>
              
              {changePassword && (
                <div className="space-y-2">
                  <Label htmlFor="user-password">Password Baru *</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Masukkan password baru"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={changePassword}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password default: {DEFAULT_PASSWORD}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor="user-password">Password *</Label>
              <Input
                id="user-password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password default: {DEFAULT_PASSWORD}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {user ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
