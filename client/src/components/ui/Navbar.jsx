import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">🖥️</span>
          <span className="brand-name">MyPCbuilder</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/builder"
          className={`nav-link ${isActive('/builder') ? 'active' : ''}`}
        >
          Builder
        </Link>
        <Link
          to="/about"
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
        >
          About
        </Link>
      </div>
    </nav>
  )
}