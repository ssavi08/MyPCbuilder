# 🖥️ MyPCbuilder

**Interactive 3D PC Builder Web Application**

A web application for interactive 3D PC assembly using Three.js. Users select a purpose (school, work, or gaming) and enter a budget to receive AI-generated optimal PC configurations. Each component can be individually viewed, customized, and visualized in an interactive 3D scene.

---

## 🎯 Features

- **3D Visualization** — Interactive 3D scene where users can view and rotate a PC build using Three.js
- **AI-Powered Recommendations** — Optimal configurations generated via OpenAI API based on purpose and budget
- **Three Use Cases** — Tailored builds for school, work, and gaming
- **Budget Filtering** — Components filtered by user-defined budget
- **Component Customization** — Each component (CPU, GPU, RAM, storage, PSU) can be individually selected and swapped
- **Compatibility Validation** — Deterministic backend logic ensures all selected components are compatible
- **Real-Time Updates** — 3D scene updates dynamically when components are changed

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| React | UI framework |
| Vite | Build tool and dev server |
| React Router DOM | SPA page navigation |
| Three.js | 3D rendering engine |
| React Three Fiber | React integration for Three.js |
| Drei | Helper utilities for React Three Fiber |
| Zustand | Global state management |

### Backend

| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |
| OpenAI SDK | AI-powered build recommendations |

---

## 📁 Project Structure

```
MyPCbuilder/
│
├── client/                     → React frontend
│   ├── public/
│   │   └── models/             → 3D model files (.glb)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             → Reusable UI components
│   │   │   ├── builder/        → PC builder interface components
│   │   │   └── three/          → 3D scene components
│   │   ├── pages/              → Route pages (Home, Builder, About)
│   │   ├── store/              → Zustand state management
│   │   ├── services/           → API communication layer
│   │   ├── router/             → React Router configuration
│   │   ├── data/               → Static component data
│   │   └── utils/              → Helper functions
│   └── package.json
│
├── server/                     → Express backend
│   ├── src/
│   │   ├── controllers/        → Request handlers
│   │   ├── routes/             → API route definitions
│   │   ├── services/           → Business logic (AI, compatibility)
│   │   ├── data/               → Component dataset
│   │   └── server.js           → Express app entry point
│   ├── .env                    → Environment variables (not tracked)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/MyPCbuilder.git
cd MyPCbuilder
```

**2. Setup backend**

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3001
OPENAI_API_KEY=your-openai-api-key-here
```

**3. Setup frontend**

```bash
cd ../client
npm install
```

### Running the Application

You need two terminals running simultaneously:

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/components?type=cpu` | Fetch components by type |
| GET | `/api/components?type=gpu` | Fetch GPU components |
| GET | `/api/components?type=ram` | Fetch RAM components |
| POST | `/api/generate-build` | Generate AI-optimized PC build |
| GET | `/api/health` | Server health check |

---

## ⚙️ Architecture Flow

```
User Input (purpose + budget)
        ↓
Compatibility Engine (deterministic backend logic)
        ↓
Candidate Component Pool (filtered compatible parts)
        ↓
OpenAI API (selects optimal build from candidates)
        ↓
Frontend receives recommendation
        ↓
3D Scene updates with selected components
```

The compatibility engine handles all hardware validation (socket types, RAM compatibility, PSU wattage). AI is only responsible for selecting the best combination and explaining the recommendation.

---

## 📝 License

This project was created as a faculty final project.

---

## 👤 Author

**Savi Sandro**
Faculty Final Project — Interactive 3D PC Assembly Web Application