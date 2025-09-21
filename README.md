# 🛰️ Swarm Control System Dashboard

A real-time **Swarm-to-Swarm Control Team Dashboard** for disaster management and rescue operations.  
Built for **Smart India Hackathon (SIH 2025)**, this system enables command centers to **monitor, coordinate, and control rescue drone swarms** with live situational awareness.

---

## 🚨 Problem Statement
During disasters, the biggest challenges are:
- **Critical Delays** – Gap between disaster occurrence and rescue initiation.  
- **Blind Search** – Rescue teams risk lives without knowing where victims are.  
- **Lack of Real-Time Data** – Outdated or incomplete situational intel.  
- **Risk to Rescuers** – Without proper intel, rescuers themselves are endangered.  

---

## 🎯 Our Solution
The Swarm Control System Dashboard:
- Provides a **real-time 3D map** of the disaster site (digital twin).  
- Tracks **drones, victims, hazards, and rescue teams** on one unified interface.  
- Uses **AI-powered victim detection** (thermal vision, computer vision, audio processing).  
- Ensures **safe navigation paths** for rescue teams.  
- Generates **automated mission reports** post-operation.  

---

## 🛠️ Tech Stack

### Frontend
- ⚡ [Vite](https://vitejs.dev/) – Fast, modern build tool  
- 🟦 [TypeScript](https://www.typescriptlang.org/) – Strongly typed frontend logic  
- 🎨 CSS Modules / Tailwind (optional) – Modular UI styling  
- 🌍 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) or [CesiumJS](https://cesium.com/platform/cesiumjs/) – 2D/3D map integration  

### Backend (Future Scope)
- 🌐 Node.js + Express – REST APIs for drone/rescue data  
- 🔌 WebSockets / MQTT – Real-time telemetry  
- 🧠 AI/ML Services – Victim detection (thermal + computer vision)  

---

## 📊 Dashboard Features

### 1. Real-Time Disaster Map
- **3D Digital Twin** of affected area  
- Victim overlays:  
  - 🔴 Critical  
  - 🟡 Injured  
  - ⚪ Deceased  
- Drone swarm tracking with live paths  
- Hazard zones (fire, flood, collapse risk)  
- Safe zones for staging rescue  

### 2. Drone & Swarm Status
- Active vs available drones  
- Battery health, signal strength, docking status  
- Live drone video feed  

### 3. Victim Detection & Rescue Queue
- Victim ID & location  
- Condition status + AI confidence score  
- Rescue team assignment & progress tracking  

### 4. Rescue Team Coordination
- GPS tracking of teams  
- Safe path navigation  
- Communication logs  

### 5. Alerts & Notifications
- New victim detection  
- Hazard warnings  
- Drone/system failures  

### 6. Mission Analytics
- Total victims detected, rescued, confirmed safe  
- Area coverage %  
- Response time metrics  

---

## 🖼️ Dashboard Mockup
*(Example visualization – actual implementation will evolve)*  

![Dashboard Preview](docs/dashboard-preview.png)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) >= 18.x  
- npm or yarn  

### Installation
```bash
# Clone repository
git clone https://github.com/Infintie-Eye/Swarm-Control-System.git

# Navigate to project
cd Swarm-Control-System

# Install dependencies
npm install

# Run development server
npm run dev
```

--- 

# Build for Production
npm run build

---

# 📂 Repository Structure

Swarm-Control-System/
│── public/              # Static assets
│── src/
│   ├── components/      # UI components
│   ├── pages/           # Dashboard pages
│   ├── services/        # API & socket services
│   ├── styles/          # CSS/Theme
│   └── main.tsx         # Entry point
│── docs/                # Documentation & mockups
│── package.json
│── README.md

---

# 📌 Future Scope

-🤖 Predicting aftershock zones via AI.

-🦾 Drones with robotic arms for debris clearance.

-🚑 Integration with ambulance & hospital networks.

-🌍 Cloud-based coordination for multiple disaster sites.

---

# 📜 License

This project is developed for Smart India Hackathon 2025.
Open for academic and research use. For commercial inquiries, contact the maintainers.