import { useEffect } from "react"
import { User, Project, Task } from "@/lib/types"

const DEFAULT_PASSWORD = "Ikuhub@2025"

export function useDemoData(
  users: User[],
  projects: Project[],
  tasks: Task[],
  setUsers: (value: User[] | ((prev?: User[]) => User[])) => void,
  setProjects: (value: Project[] | ((prev?: Project[]) => Project[])) => void,
  setTasks: (value: Task[] | ((prev?: Task[]) => Task[])) => void
) {
  useEffect(() => {
    if (users.length === 0 && projects.length === 0 && tasks.length === 0) {
      const demoUsers: User[] = [
        {
          id: 'demo-user-1',
          name: 'Budi Santoso',
          email: 'budi@ikuhub.com',
          role: 'Project Manager',
          password: DEFAULT_PASSWORD,
          createdAt: Date.now() - 86400000 * 10,
        },
        {
          id: 'demo-user-2',
          name: 'Siti Aminah',
          email: 'siti@ikuhub.com',
          role: 'Developer',
          password: DEFAULT_PASSWORD,
          createdAt: Date.now() - 86400000 * 9,
        },
        {
          id: 'demo-user-3',
          name: 'Ahmad Hidayat',
          email: 'ahmad@ikuhub.com',
          role: 'Designer',
          password: DEFAULT_PASSWORD,
          createdAt: Date.now() - 86400000 * 8,
        },
      ]

      const demoProjects: Project[] = [
        {
          id: 'demo-project-1',
          name: 'Website Company Profile',
          customer: 'PT. Maju Jaya',
          value: 50000000,
          description: 'Pembuatan website company profile dengan fitur lengkap termasuk blog dan gallery.',
          createdAt: Date.now() - 86400000 * 7,
        },
        {
          id: 'demo-project-2',
          name: 'Aplikasi Mobile E-Commerce',
          customer: 'CV. Berkah Sejahtera',
          value: 150000000,
          description: 'Pengembangan aplikasi mobile e-commerce untuk Android dan iOS.',
          createdAt: Date.now() - 86400000 * 5,
        },
        {
          id: 'demo-project-3',
          name: 'Sistem Manajemen Inventory',
          customer: 'PT. Global Tech',
          value: 75000000,
          description: 'Sistem manajemen inventory berbasis web dengan integrasi barcode scanner.',
          createdAt: Date.now() - 86400000 * 3,
        },
      ]

      const demoTasks: Task[] = [
        {
          id: 'demo-task-1',
          projectId: 'demo-project-1',
          title: 'Desain Mockup Homepage',
          description: 'Membuat desain mockup untuk halaman utama website',
          assignedUserIds: ['demo-user-3'],
          completed: true,
          createdAt: Date.now() - 86400000 * 6,
        },
        {
          id: 'demo-task-2',
          projectId: 'demo-project-1',
          title: 'Development Frontend',
          description: 'Implementasi desain menggunakan React dan Tailwind',
          assignedUserIds: ['demo-user-2'],
          completed: true,
          createdAt: Date.now() - 86400000 * 5,
        },
        {
          id: 'demo-task-3',
          projectId: 'demo-project-1',
          title: 'Integrasi CMS',
          description: 'Integrasi dengan headless CMS untuk konten dinamis',
          assignedUserIds: ['demo-user-2'],
          completed: false,
          createdAt: Date.now() - 86400000 * 4,
        },
        {
          id: 'demo-task-4',
          projectId: 'demo-project-2',
          title: 'Setup Project Structure',
          description: 'Inisialisasi project React Native dan struktur folder',
          assignedUserIds: ['demo-user-1', 'demo-user-2'],
          completed: true,
          createdAt: Date.now() - 86400000 * 4,
        },
        {
          id: 'demo-task-5',
          projectId: 'demo-project-2',
          title: 'Desain UI/UX',
          description: 'Membuat desain antarmuka aplikasi mobile',
          assignedUserIds: ['demo-user-3'],
          completed: false,
          createdAt: Date.now() - 86400000 * 3,
        },
        {
          id: 'demo-task-6',
          projectId: 'demo-project-3',
          title: 'Analisis Requirement',
          description: 'Meeting dengan klien untuk gathering requirement',
          assignedUserIds: ['demo-user-1'],
          completed: true,
          createdAt: Date.now() - 86400000 * 2,
        },
      ]

      setUsers(demoUsers)
      setProjects(demoProjects)
      setTasks(demoTasks)
    }
  }, [users.length, projects.length, tasks.length, setUsers, setProjects, setTasks])
}
