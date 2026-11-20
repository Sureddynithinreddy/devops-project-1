import { useState } from 'react'
import { LogOut, Menu, X, Ticket, BarChart3, Users, Settings, Home } from 'lucide-react'

export default function DashboardLayout({ children, onLogout, isAdmin = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userName = localStorage.getItem('userName') || 'User'
  const userRole = localStorage.getItem('userRole') || 'customer'

  const menuItems = isAdmin 
    ? [
        { label: 'Dashboard', icon: <BarChart3 size={20} /> },
        { label: 'Tickets', icon: <Ticket size={20} /> },
        { label: 'Users', icon: <Users size={20} /> },
        { label: 'Settings', icon: <Settings size={20} /> }
      ]
    : [
        { label: 'Dashboard', icon: <Home size={20} /> },
        { label: 'My Tickets', icon: <Ticket size={20} /> },
        { label: 'Settings', icon: <Settings size={20} /> }
      ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-primary to-secondary text-white w-64 transition-transform duration-300 fixed lg:static lg:translate-x-0 h-screen z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-white border-opacity-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Ticket size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg">CloudDesk</h1>
              <p className="text-xs text-gray-200">{userRole === 'admin' ? 'Admin' : 'Customer'}</p>
            </div>
          </div>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white border-opacity-20">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-200 mb-1">Logged in as</p>
            <p className="font-semibold">{userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg font-semibold transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{userName.charAt(0)}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
