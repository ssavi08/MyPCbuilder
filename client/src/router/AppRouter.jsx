import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Builder from '../pages/Builder'
import About from '../pages/About'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/about" element={<About />} />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}