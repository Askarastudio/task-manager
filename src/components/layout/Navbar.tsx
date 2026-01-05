import { House, FolderOpen, Users, Buildings, SignOut, List, X, ChartBar } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AuthSession } from "@/lib/types"

interface NavbarProps {
  session: AuthSession
  companyName: string
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  companyLogo?: string
}

export function Navbar({ session, companyName, currentPage, onNavigate, onLogout, companyLogo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: House },
    { id: 'projects', label: 'Proyek', icon: FolderOpen },
    { id: 'reports', label: 'Laporan', icon: ChartBar },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'company', label: 'Pengaturan', icon: Buildings },
  ]

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {companyLogo ? (
                <img src={companyLogo} alt="Logo" className="h-10 w-auto" />
              ) : (
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                  <Buildings size={24} weight="bold" className="text-primary-foreground" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-foreground">IkuHub Proyeksi</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => handleNavigate(item.id)}
                    className="gap-2"
                  >
                    <Icon size={18} weight={currentPage === item.id ? "fill" : "regular"} />
                    {item.label}
                  </Button>
                )
              })}
              <Separator orientation="vertical" className="h-8 mx-2" />
              <Button variant="ghost" onClick={onLogout} className="gap-2 text-destructive hover:text-destructive">
                <SignOut size={18} />
                Keluar
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </Button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => handleNavigate(item.id)}
                  className={cn("w-full justify-start gap-2", currentPage === item.id && "bg-primary")}
                >
                  <Icon size={18} weight={currentPage === item.id ? "fill" : "regular"} />
                  {item.label}
                </Button>
              )
            })}
            <Separator className="my-2" />
            <Button variant="ghost" onClick={onLogout} className="w-full justify-start gap-2 text-destructive hover:text-destructive">
              <SignOut size={18} />
              Keluar
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
