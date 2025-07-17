import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from '../pages/LoginPage'
import RegisterForm from '../pages/LoginPage/components/RegisterForm'
import DashboardRedirect from '../pages/DashboardPage'
import FreelancerDashboard from '../pages/FreelancerPage/Dashboard'
import ClientDashboard from '../pages/ClientsPage/Dashboard'
import ProfilePage from '../pages/ProfilePage'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

export const AppRouter = () => {
  const { token, role } = useSelector((state: RootState) => state.user)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterForm />} />

        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route
          path="/freelancer/dashboard"
          element={
            token && role === 'freelancer' ? (
              <FreelancerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/client/dashboard"
          element={
            token && role === 'client' ? (
              <ClientDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={token ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
