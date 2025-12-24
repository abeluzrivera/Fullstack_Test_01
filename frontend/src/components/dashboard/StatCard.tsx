import {
  Folder,
  Clock,
  Check,
  TrendingUp,
  ListTodo,
  Circle,
} from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string
  icon: 'folder' | 'clock' | 'check' | 'trending' | 'list' | 'circle'
  bgColor: string
  iconColor: string
}

export default function StatCard({
  title,
  value,
  icon,
  bgColor,
  iconColor,
}: StatCardProps) {
  const icons = {
    folder: Folder,
    clock: Clock,
    check: Check,
    trending: TrendingUp,
    list: ListTodo,
    circle: Circle,
  }

  const Icon = icons[icon]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
