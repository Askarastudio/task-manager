import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Project, Task, ProjectWithProgress, ProjectStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateProjectProgress(project: Project, tasks: Task[]): ProjectWithProgress {
  const projectTasks = tasks.filter(task => task.projectId === project.id)
  const completedTasks = projectTasks.filter(task => task.completed)
  
  const progress = projectTasks.length === 0 
    ? 0 
    : Math.round((completedTasks.length / projectTasks.length) * 100)
  
  let status: ProjectStatus = 'Perencanaan'
  if (progress === 100) {
    status = 'Selesai'
  } else if (progress > 0) {
    status = 'On Progress'
  }
  
  return {
    ...project,
    progress,
    status,
    taskCount: projectTasks.length,
    completedTaskCount: completedTasks.length,
  }
}

export function getStatusColor(status: ProjectStatus): string {
  switch (status) {
    case 'Perencanaan':
      return 'bg-muted text-muted-foreground'
    case 'On Progress':
      return 'bg-info/10 text-info border-info/20'
    case 'Selesai':
      return 'bg-success/10 text-success border-success/20'
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(timestamp)
}
