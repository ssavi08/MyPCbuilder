import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const Builder = lazy(() => import('../pages/Builder'))
const About   = lazy(() => import('../pages/About'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <div className="page-wrapper" key={location.pathname}>
      <Routes location={location}>
        <Route path="/"        element={<Builder />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/about"   element={<About />}   />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div style={{
          height:          '100vh',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          color:           '#94a3b8',
          fontSize:        14,
          fontFamily:      'system-ui',
        }}>
          Loading...
        </div>
      }>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  )
}