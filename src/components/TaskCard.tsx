import { motion } from "framer-motion"
import { Trash } from "@phosphor-icons/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className="p-4 hover:shadow-md transition-shadow duration-100 group">
        <div className="flex items-start gap-3">
          <Checkbox
            id={task.id}
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <motion.label
              htmlFor={task.id}
              className={`block text-base cursor-pointer transition-all duration-300 ${
                task.completed
                  ? "line-through opacity-50"
                  : ""
              }`}
              animate={{ opacity: task.completed ? 0.5 : 1 }}
            >
              {task.title}
            </motion.label>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash size={18} />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
