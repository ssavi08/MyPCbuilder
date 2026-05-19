import { useNavigate } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-main">

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">🤖 AI-Powered</div>
            <h1 className="hero-title">
              Build Your Perfect
              <span className="hero-title-highlight"> PC</span>
            </h1>
            <p className="hero-subtitle">
              Select your purpose and budget. Let AI recommend the
              optimal configuration. Visualize your build in interactive 3D.
            </p>

            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate('/builder')}
              >
                Start Building →
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="pc-preview">🖥️</div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="use-cases">
          <h2>What are you building for?</h2>
          <div className="use-case-cards">

            <div
              className="use-case-card"
              onClick={() => navigate('/builder')}
            >
              <div className="use-case-icon">🎓</div>
              <h3>School</h3>
              <p>
                Reliable performance for studying,
                research, and online classes
              </p>
              <span className="use-case-budget">Budget: 500€ - 800€</span>
            </div>

            <div
              className="use-case-card"
              onClick={() => navigate('/builder')}
            >
              <div className="use-case-icon">💼</div>
              <h3>Work</h3>
              <p>
                Powerful workstation for productivity,
                multitasking, and professional software
              </p>
              <span className="use-case-budget">Budget: 800€ - 1500€</span>
            </div>

            <div
              className="use-case-card featured"
              onClick={() => navigate('/builder')}
            >
              <div className="use-case-icon">🎮</div>
              <h3>Gaming</h3>
              <p>
                High-performance rig for the latest games
                at maximum settings
              </p>
              <span className="use-case-budget">Budget: 1000€ - 2500€</span>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="feature">
            <span className="feature-icon">🧊</span>
            <h3>3D Visualization</h3>
            <p>See your build come to life in real-time 3D</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <h3>AI Recommendations</h3>
            <p>ChatGPT picks the best parts for your needs</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✅</span>
            <h3>Compatibility Check</h3>
            <p>Every build is validated for compatibility</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💰</span>
            <h3>Budget Control</h3>
            <p>Always stay within your price range</p>
          </div>
        </section>

      </main>
    </div>
  )
}