<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.109.0-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

<h1 align="center">🌍 EcoFlux Intelligence</h1>
<h3 align="center">Sustainable AI Infrastructure Optimization Platform</h3>

<p align="center">
  <strong>Real-time sustainability auditing and optimization for data centers and AI infrastructure</strong>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=Thiru-Selvam-06&label=Project%20Views&color=0e75b6&style=flat" alt="views" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat" alt="status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat" alt="license" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**EcoFlux Intelligence** is a comprehensive sustainability auditing platform designed for AI infrastructure and data centers. It provides real-time analysis of environmental impact, resource consumption, and operational efficiency through advanced simulations and data-driven recommendations.

### What Does EcoFlux Do?

EcoFlux analyzes your data center operations across multiple dimensions:

- **Energy Consumption**: Calculates total energy usage based on compute load and workload type
- **Water Usage**: Estimates water consumption for cooling systems based on climate conditions
- **Carbon Emissions**: Computes carbon footprint considering renewable energy mix and grid intensity
- **Sustainability Score**: Generates comprehensive sustainability metrics (0-100 scale)
- **Cost Analysis**: Provides detailed cost breakdowns and optimization strategies
- **Climate Adaptation**: Offers location-specific recommendations based on real-time climate data

---

## ✨ Key Features

### 🎯 Core Capabilities

- **🌐 Location-Based Analysis**
  - Interactive world map for location selection
  - Geocoding integration for precise coordinates
  - Region-specific climate and environmental data

- **⚡ Multi-Workload Support**
  - AI Training workloads
  - High-Performance Computing (HPC)
  - General data center operations
  - Edge computing scenarios

- **💧 Cooling System Optimization**
  - Air Cooling analysis
  - Liquid Cooling efficiency metrics
  - Immersion Cooling evaluation
  - Hybrid system recommendations

- **📊 Comprehensive Metrics Dashboard**
  - Real-time sustainability scoring
  - Energy usage visualization (MWh)
  - Water consumption tracking (ML)
  - Carbon emission monitoring (tons CO2)
  - Cost efficiency analysis

- **🔮 Future Projections**
  - 5-year and 10-year trend forecasting
  - Climate change impact modeling
  - Resource optimization scenarios

- **🎨 Beautiful UI/UX**
  - Cinematic video backgrounds
  - Smooth page transitions
  - Interactive charts and gauges
  - Responsive design for all devices

---

## 🛠️ Tech Stack

### Frontend

```
├── React 18.2.0          # UI Framework
├── Vite 5.0.0            # Build Tool & Dev Server
├── Recharts 2.10.3       # Data Visualization
├── Leaflet 1.9.4         # Interactive Maps
├── React Leaflet 4.2.1   # React Wrapper for Leaflet
├── Lucide React 0.577.0  # Icon Library
└── Google Maps React     # Google Maps Integration
```

### Backend

```
├── FastAPI               # Modern Python Web Framework
├── Uvicorn              # ASGI Server
├── SQLAlchemy           # ORM for Database
├── Pydantic             # Data Validation
├── Supabase             # PostgreSQL Database & Auth
├── Redis                # Caching Layer
├── HTTPX                # Async HTTP Client
├── Loguru               # Advanced Logging
└── Alembic              # Database Migrations
```

### External APIs

- **OpenWeather API**: Climate and temperature data
- **Electricity Maps API**: Real-time renewable energy mix
- **NASA POWER API**: Historical climate data
- **WRI Aqueduct**: Water stress indicators
- **Nominatim/OSM**: Geocoding services

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Landing Page │  │ Location Map │  │ Results Page │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Cooling Page │  │ Projections  │  │ Scenarios    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes Layer                        │   │
│  │         /simulate | /health | /favicon.ico           │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Service Layer (Business Logic)            │   │
│  │  • Geocoding    • Climate       • Energy             │   │
│  │  • Water        • Carbon        • Sustainability     │   │
│  │  • Strategy     • Cost          • Environmental      │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Repository Layer (Data Access)             │   │
│  │  • User Inputs  • Simulation Results • Comparisons   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Supabase PostgreSQL Database                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ user_inputs  │  │   results    │  │ comparisons  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Python** (v3.11 or higher)
- **pip** (latest version)
- **Git**

### Required API Keys

You'll need to obtain free API keys from:

1. **Supabase** → [https://supabase.com](https://supabase.com)
2. **OpenWeather API** → [https://openweathermap.org/api](https://openweathermap.org/api)
3. **Google Maps API** (optional) → [https://developers.google.com/maps](https://developers.google.com/maps)
4. **Electricity Maps API** (optional) → [https://www.electricitymaps.com](https://www.electricitymaps.com)

### Check Your Versions

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
python --version  # Should be 3.11+
pip --version     # Should be latest
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Thiru-Selvam-06/Echo-Flux.git
cd Echo-Flux
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd ecoflux_backend
```

#### 2.2 Create Virtual Environment (Recommended)

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2.4 Create Environment File

Create a `.env` file in the `ecoflux_backend` directory:

```bash
# On Windows
type nul > .env

# On macOS/Linux
touch .env
```

Add the following content to `.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ecoflux
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Redis Cache
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your_secret_key_here_change_in_production

# External APIs
OPENWEATHER_API_KEY=your_openweather_api_key
ELECTRICITY_MAPS_API_KEY=your_electricity_maps_api_key  # Optional
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
cd ../ecoflux_frontend
```

#### 3.2 Install Node Dependencies

```bash
npm install
```

**Or using yarn:**
```bash
yarn install
```

#### 3.3 Create Environment File

Create a `.env` file in the `ecoflux_frontend` directory:

```bash
# On Windows
type nul > .env

# On macOS/Linux
touch .env
```

Add the following content to `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key  # Optional
```

---

## ⚙️ Configuration

### Supabase Database Setup

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Create Database Tables**

Run these SQL commands in Supabase SQL Editor:

```sql
-- User Inputs Table
CREATE TABLE user_inputs (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    compute_load_mw FLOAT NOT NULL,
    cooling_method TEXT NOT NULL,
    renewable_percent FLOAT,
    water_availability TEXT,
    workload_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Simulation Results Table
CREATE TABLE simulation_results (
    id SERIAL PRIMARY KEY,
    input_id INTEGER REFERENCES user_inputs(id),
    temperature FLOAT,
    climate_label TEXT,
    climate_multiplier FLOAT,
    renewable_share_percent FLOAT,
    water_stress_index FLOAT,
    energy_usage FLOAT,
    water_usage FLOAT,
    carbon_emission FLOAT,
    sustainability_score FLOAT,
    recommended_strategy TEXT,
    recommended_cooling TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cooling Comparisons Table
CREATE TABLE cooling_comparisons (
    id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulation_results(id),
    cooling_method TEXT NOT NULL,
    energy_usage FLOAT,
    water_usage FLOAT,
    carbon_emission FLOAT,
    sustainability_score FLOAT,
    total_cost_usd FLOAT,
    cost_efficiency_score FLOAT,
    final_decision_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Redis Setup (Optional but Recommended)

**On Windows (using WSL or Docker):**
```bash
docker run -d -p 6379:6379 redis:latest
```

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

---

## 🎮 Running the Application

### Option 1: Run Both Services Separately

#### Terminal 1 - Backend Server

```bash
cd ecoflux_backend
# Activate virtual environment (if not already activated)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run FastAPI server
python main.py
```

The backend will start on: **http://localhost:8000**

API Docs available at: **http://localhost:8000/docs**

#### Terminal 2 - Frontend Development Server

```bash
cd ecoflux_frontend

# Run Vite dev server
npm run dev
```

The frontend will start on: **http://localhost:5173**

### Option 2: Production Build

#### Build Frontend for Production

```bash
cd ecoflux_frontend
npm run build
```

This creates an optimized build in the `dist` folder.

#### Serve Production Build

```bash
npm run preview
```

#### Run Backend in Production Mode

```bash
cd ecoflux_backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 📚 API Documentation

### Available Endpoints

#### 1. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "running"
}
```

#### 2. Run Simulation

```http
POST /simulate
```

**Request Body:**
```json
{
  "location": "Bangalore, India",
  "compute_load_mw": 100,
  "cooling_method": "liquid",
  "workload_type": "AI Training",
  "electricity_price_kwh": 0.12
}
```

**Response:**
```json
{
  "location": "Bangalore, India",
  "environmental_metrics": {
    "renewable_share_percent": 45.2,
    "water": {
      "water_stress_index": 0.62,
      "water_availability": "medium"
    }
  },
  "coordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "climate": {
    "temperature_c": 24.5,
    "climate_label": "Moderate",
    "climate_multiplier": 1.0
  },
  "energy_usage_mw": 125.6,
  "water_usage_index": 45.3,
  "carbon_emission_index": 67.8,
  "sustainability_score": 72.5,
  "recommended_strategy": "Optimize renewable energy mix",
  "recommended_cooling": "liquid",
  "comparison_table": [...]
}
```

### Interactive API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📁 Project Structure

```
Echo-Flux/
│
├── ecoflux_backend/           # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── simulation.py        # Main simulation endpoint
│   │   ├── core/
│   │   │   └── config.py                # Configuration management
│   │   ├── database/
│   │   │   └── supabase_client.py       # Database connection
│   │   ├── models/                      # SQLAlchemy models
│   │   ├── repositories/
│   │   │   └── simulation_repo.py       # Data access layer
│   │   ├── schemas/
│   │   │   └── simulation_schema.py     # Pydantic models
│   │   ├── services/                    # Business logic
│   │   │   ├── carbon_service.py        # Carbon calculations
│   │   │   ├── climate_service.py       # Climate data
│   │   │   ├── cost_service.py          # Cost analysis
│   │   │   ├── electricity_service.py   # Energy mix data
│   │   │   ├── energy_service.py        # Energy calculations
│   │   │   ├── environmental_service.py # Environment metrics
│   │   │   ├── geocoding_service.py     # Location services
│   │   │   ├── strategy_service.py      # Recommendations
│   │   │   ├── sustainability_service.py# Sustainability scoring
│   │   │   ├── water_scarcity_service.py# Water stress data
│   │   │   └── water_service.py         # Water calculations
│   │   └── utils/                       # Utility functions
│   ├── main.py                          # FastAPI application entry
│   ├── requirements.txt                 # Python dependencies
│   └── .env                             # Environment variables
│
├── ecoflux_frontend/          # React + Vite Frontend
│   ├── public/
│   │   ├── hero_bg.mp4                  # Background video
│   │   └── _redirects                   # Netlify redirects
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Reusable components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── GaugeChart.jsx
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   ├── NavBar.jsx
│   │   │   │   ├── Tag.jsx
│   │   │   │   └── WorldMap.jsx
│   │   │   └── pages/                   # Page components
│   │   │       ├── LandingPage.jsx
│   │   │       ├── LocationPage.jsx
│   │   │       ├── ProcessingPage.jsx
│   │   │       ├── ResultsPage.jsx
│   │   │       ├── CoolingPage.jsx
│   │   │       ├── ProjectionsPage.jsx
│   │   │       └── ScenarioPage.jsx
│   │   ├── constants/
│   │   │   └── theme.js                 # Theme configuration
│   │   ├── styles/
│   │   │   └── GlobalStyles.css         # Global styles
│   │   ├── utils/
│   │   │   ├── api.js                   # API communication
│   │   │   └── simulation.js            # Local simulation fallback
│   │   ├── App.jsx                      # Main application component
│   │   └── main.jsx                     # Application entry point
│   ├── index.html                       # HTML template
│   ├── package.json                     # Node dependencies
│   ├── vite.config.js                   # Vite configuration
│   └── .env                             # Environment variables
│
└── README.md                            # This file
```

---

## 🔍 How It Works

### User Flow

1. **Landing Page**
   - User views project introduction and features
   - Clicks "Start Sustainability Audit"

2. **Location Selection**
   - Interactive world map appears
   - User selects their data center location
   - System auto-detects climate conditions and water stress

3. **Configuration Input**
   - Compute Load (MW): Data center power capacity
   - Cooling Method: Air / Liquid / Immersion
   - Workload Type: AI Training / HPC / General
   - System automatically fetches renewable energy data

4. **Processing**
   - Beautiful loading animation
   - Backend performs multi-API calls:
     - Geocoding for coordinates
     - Climate data from NASA/OpenWeather
     - Water stress from WRI Aqueduct
     - Renewable energy mix from Electricity Maps
   - Calculations performed:
     - Energy consumption modeling
     - Water usage estimation
     - Carbon footprint calculation
     - Cost analysis
     - Sustainability scoring

5. **Results Dashboard**
   - Comprehensive metrics display
   - Interactive charts and gauges
   - Key metrics:
     - Annual Energy (MWh)
     - Water Consumption (ML)
     - Carbon Emissions (tons CO2)
     - Sustainability Score (0-100)

6. **Cooling Optimization**
   - Comparison of different cooling methods
   - Cost-benefit analysis
   - Best recommendation highlighted

7. **Future Projections**
   - 5-year and 10-year forecasts
   - Climate change impact modeling
   - Trend visualization

8. **Scenario Planning**
   - What-if analysis
   - Strategy recommendations
   - Export and share results

### Calculation Methodology

#### Energy Calculation
```python
Energy = Base_Load × Cooling_Factor × Workload_Multiplier
```

#### Water Calculation
```python
Water = Energy × Cooling_Type_Factor × Climate_Multiplier
```

#### Carbon Calculation
```python
Carbon = Energy × (1 - Renewable_Share) × Grid_Intensity
```

#### Sustainability Score
```python
Score = weighted_average([
    Energy_Efficiency_Score,
    Water_Efficiency_Score,
    Carbon_Efficiency_Score,
    Cost_Efficiency_Score
])
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/db` |
| `SUPABASE_URL` | Supabase project URL | Yes | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Supabase anon/public key | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `REDIS_URL` | Redis connection string | Yes | `redis://localhost:6379` |
| `SECRET_KEY` | Application secret key | Yes | `your-secret-key-here` |
| `OPENWEATHER_API_KEY` | OpenWeather API key | Yes | `a1b2c3d4e5f6...` |
| `ELECTRICITY_MAPS_API_KEY` | Electricity Maps API key | No | `abc123def456...` |

### Frontend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | `http://localhost:8000` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | No | `AIzaSyB...` |

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
# Make sure you're in the virtual environment
# Reinstall dependencies
pip install -r requirements.txt
```

#### 2. Database Connection Error

**Error**: `Could not connect to database`

**Solution**:
- Check your `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Ensure tables are created in Supabase
- Verify network connection

#### 3. Frontend API Calls Failing

**Error**: `Network Error` or `CORS Error`

**Solution**:
- Ensure backend is running on port 8000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify CORS settings in `main.py`

#### 4. Redis Connection Error

**Error**: `ConnectionRefusedError: [Errno 111] Connection refused`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running, start Redis
# macOS: brew services start redis
# Linux: sudo systemctl start redis
# Docker: docker run -d -p 6379:6379 redis:latest
```

#### 5. API Key Errors

**Error**: `401 Unauthorized` or `Invalid API Key`

**Solution**:
- Verify all API keys are correct and active
- Check if keys have necessary permissions
- Some APIs (NASA, OpenWeather) may take time to activate

#### 6. Port Already in Use

**Error**: `Address already in use: 8000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Getting Help

If you encounter issues not listed here:

1. Check the [GitHub Issues](https://github.com/Thiru-Selvam-06/Echo-Flux/issues)
2. Review API documentation at `/docs` endpoint
3. Enable debug logging in backend (`loguru` is configured)
4. Check browser console for frontend errors

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenWeather** for climate data API
- **Electricity Maps** for real-time energy mix data
- **NASA POWER** for historical climate information
- **Supabase** for database infrastructure
- **Leaflet** for mapping capabilities
- **FastAPI** for the amazing web framework
- **React** team for the UI library

---

## 📞 Contact

**Jagan Anandhan**

- GitHub: [@jagan631](https://github.com/jagan631)
- LinkedIn: [https://www.linkedin.com/in/jagan-anandhan-91b96127a/]
- Email: [jagananandhan631@gmail.com]

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

<p align="center">
  <img src="https://img.shields.io/github/stars/Thiru-Selvam-06/Echo-Flux?style=social" alt="stars" />
  <img src="https://img.shields.io/github/forks/Thiru-Selvam-06/Echo-Flux?style=social" alt="forks" />
  <img src="https://img.shields.io/github/watchers/Thiru-Selvam-06/Echo-Flux?style=social" alt="watchers" />
</p>

---

<p align="center">
  <strong>Built with ❤️ for a sustainable future</strong>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%" />
</p>
