import { Link }  from 'react-router-dom'
import useStore  from '../../store/useStore'
import './Navbar.css'

export default function Navbar() {
  const theme       = useStore((state) => state.theme)
  const toggleTheme = useStore((state) => state.toggleTheme)

  const isDark = theme === 'dark'

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <span className="topbar-logo-icon">⬡</span>
        <span className="topbar-logo-text">MyPCbuilder</span>
      </div>

      <nav className="topbar-nav">
        <Link to="/about" className="topbar-link">About</Link>

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className={`toggle-track ${isDark ? 'toggle-track--dark' : ''}`}>
            <div className="toggle-thumb">
              <span className="toggle-icon">
                {isDark ? '🌙' : '☀️'}
              </span>
            </div>
          </div>
        </button>
      </nav>
    </header>
  )
}