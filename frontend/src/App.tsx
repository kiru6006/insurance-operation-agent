import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SubmissionsListPage from './pages/SubmissionsListPage'
import SubmissionDetailPage from './pages/SubmissionDetailPage'
import CreateSubmissionPage from './pages/CreateSubmissionPage'
import ApprovalsPage from './pages/ApprovalsPage'
import ClaimsListPage from './pages/ClaimsListPage'
import ClaimDetailPage from './pages/ClaimDetailPage'
import CreateClaimPage from './pages/CreateClaimPage'
import PolicyServiceListPage from './pages/PolicyServiceListPage'
import PolicyServiceDetailPage from './pages/PolicyServiceDetailPage'
import CreatePolicyServicePage from './pages/CreatePolicyServicePage'
import KnowledgePage from './pages/KnowledgePage'
import AgentControlPlanePage from './pages/AgentControlPlanePage'
import AuditTrailPage from './pages/AuditTrailPage'
import Layout from './layouts/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <HashRouter>
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
          <Route path="claims" element={<ClaimsListPage />} />
          <Route path="claims/new" element={<CreateClaimPage />} />
          <Route path="claims/:id" element={<ClaimDetailPage />} />
          <Route path="policy-service" element={<PolicyServiceListPage />} />
          <Route path="policy-service/new" element={<CreatePolicyServicePage />} />
          <Route path="policy-service/:id" element={<PolicyServiceDetailPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="agents" element={<AgentControlPlanePage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="audit" element={<AuditTrailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
