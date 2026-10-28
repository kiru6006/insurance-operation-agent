import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Layout() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-8">Insurance Agent</h1>
        <nav className="space-y-3 flex-1">
          <a href="/" className="block text-gray-300 hover:text-white text-sm font-medium">Dashboard</a>
          <a href="/submissions" className="block text-gray-300 hover:text-white text-sm font-medium">Underwriting Submissions</a>
          <a href="/approvals" className="block text-gray-300 hover:text-white text-sm font-medium">Approvals Inbox</a>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition duration-150"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <h2 className="text-white text-lg font-semibold">Dashboard</h2>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
