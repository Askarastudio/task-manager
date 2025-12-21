import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  taskCounts: Record<string, number>
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  taskCounts 
}: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
          className="shrink-0"
          size="sm"
        >
          All ({Object.values(taskCounts).reduce((a, b) => a + b, 0)})
        </Button>
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          
          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelectCategory(category)}
              className="shrink-0"
              size="sm"
            >
              {category} ({taskCounts[category] || 0})
            </Button>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
