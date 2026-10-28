import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { label: 'Operations Dashboard', path: '/' },
    { label: 'Underwriting Dossiers', path: '/submissions' },
    { label: 'Claims Adjudication', path: '/claims' },
    { label: 'Policy Servicing', path: '/policy-service' },
    { label: 'Knowledge Base & RAG', path: '/knowledge' },
    { label: 'Agent Control Plane', path: '/agents' },
    { label: 'Approvals Inbox', path: '/approvals' },
    { label: 'Audit Trail & Compliance', path: '/audit' },
  ]

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-base">
              IO
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">InsureOps AI</h1>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">Workflow Layer</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>User: <span className="text-white font-semibold">{user?.username || 'Operator'}</span></span>
            <span className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 text-[10px] uppercase font-bold">{user?.role || 'Admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gray-800/80 backdrop-blur border-b border-gray-700/80 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-gray-400 font-medium">Autonomous Core Systems Connected (PAS, CMS, CRM, RAG)</span>
          </div>
          <div className="text-xs text-gray-400">
            Autonomy Tier: <span className="font-semibold text-emerald-400">Governance Level 1-3 Active</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
