import type { Task } from '@/types/api'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  title: string
  count: number
  tasks: Task[]
  status: string
}

export function KanbanColumn({ title, count, tasks }: KanbanColumnProps) {
  return (
    <div className="bg-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          {title} <span className="text-gray-500">({count})</span>
        </h3>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  )
}
