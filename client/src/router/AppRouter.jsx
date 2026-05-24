import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const Home     = lazy(() => import('../pages/Home'))
const Builder  = lazy(() => import('../pages/Builder'))
const About    = lazy(() => import('../pages/About'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <div className="page-wrapper" key={location.pathname}>
      <Routes location={location}>
        <Route path="/"        element={<Home />}    />
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
      <Suspense fallback={<div style={{ color: 'white', padding: 20 }}>Loading...</div>}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  )
}