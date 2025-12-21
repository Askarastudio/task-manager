import { CheckCircle } from "@phosphor-icons/react"

interface EmptyStateProps {
  hasFilter: boolean
}

export function EmptyState({ hasFilter }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <CheckCircle size={64} className="text-muted-foreground mb-4" weight="thin" />
      <h3 className="text-xl font-semibold mb-2 text-foreground">
        {hasFilter ? "No tasks in this category" : "No tasks yet"}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {hasFilter 
          ? "Try selecting a different category or add a new task."
          : "Start organizing your day by adding your first task above."}
      </p>
    </div>
  )
}
