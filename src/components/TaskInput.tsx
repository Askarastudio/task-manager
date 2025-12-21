import { useState } from "react"
import { Plus } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskInputProps {
  categories: string[]
  onAddTask: (title: string, category: string) => void
}

export function TaskInput({ categories, onAddTask }: TaskInputProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "Personal")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim(), selectedCategory)
      setTaskTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input
        id="task-input"
        type="text"
        placeholder="Add a new task..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="flex-1"
      />
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="gap-2">
        <Plus size={20} />
        Add Task
      </Button>
    </form>
  )
}
