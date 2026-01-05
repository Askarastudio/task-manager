import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Project, Task, ProjectWithProgress, ProjectStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateProjectProgress(project: Project, tasks: Task[]): ProjectWithProgress {
  const projectTasks = tasks.filter(task => task.projectId === project.projectId)
  const completedTasks = projectTasks.filter(task => task.completed)
  
  const progress = projectTasks.length === 0 
    ? 0 
    : Math.round((completedTasks.length / projectTasks.length) * 100)
  
  return {
    ...project,
    progress,
    taskCount: projectTasks.length,
    completedTaskCount: completedTasks.length,
  }
}

export function getStatusColor(status: ProjectStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-muted text-muted-foreground'
    case 'in-progress':
      return 'bg-info/10 text-info border-info/20'
    case 'completed':
      return 'bg-success/10 text-success border-success/20'
    case 'onhold':
      return 'bg-warning/10 text-warning border-warning/20'
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
