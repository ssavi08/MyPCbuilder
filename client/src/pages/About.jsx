import { useNavigate } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import './About.css'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      <Navbar />

      <main className="about-main">
        <div className="about-header">
          <h1>About MyPCbuilder</h1>
          <p>Faculty Final Project — Interactive 3D PC Assembly</p>
        </div>

        <div className="about-grid">

          <div className="about-card">
            <h2>🎯 Project Goal</h2>
            <p>
              MyPCbuilder is an interactive web application that helps users
              configure and visualize a custom PC build based on their purpose
              and budget. Using AI-powered recommendations and real-time 3D
              visualization, users can explore, customize and understand each
              component of their ideal PC.
            </p>
          </div>

          <div className="about-card">
            <h2>⚙️ How It Works</h2>
            <ol>
              <li>Select your use case — school, work, or gaming</li>
              <li>Enter your budget</li>
              <li>AI generates an optimal compatible build</li>
              <li>Explore the build in interactive 3D</li>
              <li>Customize individual components</li>
            </ol>
          </div>

          <div className="about-card">
            <h2>🛠️ Tech Stack</h2>
            <div className="tech-list">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Three.js</span>
              <span className="tech-tag">React Three Fiber</span>
              <span className="tech-tag">Zustand</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">OpenAI API</span>
              <span className="tech-tag">Vite</span>
            </div>
          </div>

          <div className="about-card">
            <h2>🏗️ Architecture</h2>
            <div className="arch-flow">
              <div className="arch-step">User Input</div>
              <div className="arch-arrow">↓</div>
              <div className="arch-step">Compatibility Engine</div>
              <div className="arch-arrow">↓</div>
              <div className="arch-step">OpenAI API</div>
              <div className="arch-arrow">↓</div>
              <div className="arch-step">3D Visualization</div>
            </div>
          </div>

        </div>

        <div className="about-cta">
          <button
            className="btn-primary"
            onClick={() => navigate('/builder')}
          >
            Try the Builder →
          </button>
        </div>

      </main>
    </div>
  )
}