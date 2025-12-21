import { useState } from "react"
import { Plus, Pencil, Trash, UserCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "@/lib/types"
import { UserDialog } from "@/components/users/UserDialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UsersPageProps {
  users: User[]
  onCreateUser: (user: Omit<User, 'id' | 'createdAt'>) => void
  onUpdateUser: (id: string, user: Omit<User, 'id' | 'createdAt'>) => void
  onDeleteUser: (id: string) => void
}

export function UsersPage({ users, onCreateUser, onUpdateUser, onDeleteUser }: UsersPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleCreate = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleSave = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      onUpdateUser(editingUser.id, userData)
    } else {
      onCreateUser(userData)
    }
    setDialogOpen(false)
    setEditingUser(null)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">Kelola tim dan anggota proyek</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} weight="bold" />
          Tambah User
        </Button>
      </div>

      {users.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <UserCircle size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum Ada Pengguna</h3>
            <p className="text-muted-foreground mb-6">
              Mulai dengan menambahkan anggota tim
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus size={20} weight="bold" />
              Tambah User Pertama
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="flex-1 gap-1"
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteUser(user.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSave={handleSave}
      />
    </div>
  )
}
