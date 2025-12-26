import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react'

interface SidebarLayoutProps {
  children: ReactNode
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`sidebar-container transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'w-56' : 'w-20'
        } flex flex-col flex-shrink-0`}
      >
        {/* Header con Logo y Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className={`flex items-center space-x-2 transition-all duration-300 ${!sidebarOpen ? 'justify-center w-full' : ''}`}>
            <div className="sidebar-logo w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            {sidebarOpen && <span className="text-lg font-semibold whitespace-nowrap">Project Manager</span>}
          </div>
          <button
            onClick={toggleSidebar}
            className="sidebar-nav-item p-1.5 rounded-lg transition-colors flex-shrink-0 ml-2"
            title={sidebarOpen ? 'Cerrar' : 'Abrir'}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item flex items-center space-x-3 px-3 py-2.5 rounded-lg mb-1 justify-start lg:justify-start ${
                  isActive ? 'active' : ''
                }`}
                title={!sidebarOpen ? item.name : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-base whitespace-nowrap">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`sidebar-container fixed inset-y-0 left-0 z-40 w-56 flex flex-col transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="sidebar-logo w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">Project Manager</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-sidebar-accent/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-nav-item flex items-center space-x-3 px-3 py-2.5 rounded-lg mb-1 ${
                  isActive ? 'active' : ''
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-base">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="bg-white border-b border-border h-14 flex items-center px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
