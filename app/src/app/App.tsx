import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGate } from '../features/auth/AuthGate'
import { AppShell } from './layouts/AppShell'
import { AuthLayout } from './layouts/AuthLayout'
import { AppHome } from './pages/AppHome'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ServerView } from './pages/ServerView'
import { DmView } from './pages/DmView'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/app"
        element={
          <AuthGate>
            <AppShell />
          </AuthGate>
        }
      >
        <Route index element={<AppHome />} />
        <Route path="servers/:serverId/channels/:channelId" element={<ServerView />} />
        <Route path="dms/:threadId" element={<DmView />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/home" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
