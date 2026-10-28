import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SubmissionsListPage from './pages/SubmissionsListPage'
import SubmissionDetailPage from './pages/SubmissionDetailPage'
import CreateSubmissionPage from './pages/CreateSubmissionPage'
import ApprovalsPage from './pages/ApprovalsPage'
import Layout from './layouts/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="submissions" element={<SubmissionsListPage />} />
          <Route path="submissions/new" element={<CreateSubmissionPage />} />
          <Route path="submissions/:id" element={<SubmissionDetailPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
