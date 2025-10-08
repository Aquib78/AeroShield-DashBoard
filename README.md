# AeroShield Dashboard 🛡️

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://reactjs.org/) 
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) 
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**AeroShield Dashboard** is a real-time surveillance and rescue monitoring dashboard with live drone detection, person tracking, and tactical map views.  

> **Note:** The initial version of this dashboard was developed for the Smart India Hackathon (SIH) as a demo project. It has now been upgraded with enhanced features, live map controls, and a tactical UI.

---

## 🌟 Features

- **Real-Time Monitoring**  
  Live drone and detection updates via WebSocket.

- **Interactive Map**  
  - Satellite, Terrain, and Street layers.  
  - Auto-focus on latest detection.  
  - Click markers for details and camera feed.

- **Detection Panels**  
  - Detection history with selection.  
  - Person detection history.  
  - Live system status and drone activity.

- **Responsive UI**  
  - AeroShield header with gradient text.  
  - Left rail for map tools.  
  - Bottom tactical bar with mission info.

---

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS  
- **Mapping:** React-Leaflet, Leaflet  
- **Icons:** Lucide React  
- **State Management:** React Hooks  
- **Realtime:** WebSocket integration  

---

## 🎯 Installation

```bash
git clone https://github.com/Aquib78/AeroShield-DashBoard.git
cd AeroShield-DashBoard
npm install
npm run dev

Open in browser: http://localhost:5173

🗺 Usage

Switch map types (Satellite/Terrain/Street) using buttons on the top-left.

Click markers to zoom to detection locations.

Monitor live updates via status panel.

Explore detection and person history on the right panel.

💻 Live Demo

You can view the original SIH demo here
https://youtu.be/qxko3mPTgF0

Note: The live demo shows the initial dashboard. The current repository contains the upgraded AeroShield version with improved map layers, tactical panels, and live detection integration.

💾 Database

Detection Table:

id (short, unique)

latitude, longitude

timestamp

Additional detection metadata

🖼 Screenshots
<img width="1861" height="876" alt="image" src="https://github.com/user-attachments/assets/7d219605-fe1f-4662-b2b4-45dbe263acea" />


🛠 Contributing

Fork the repo

Create a branch: git checkout -b feature/YourFeature

Commit changes: git commit -m "Add feature"

Push branch: git push origin feature/YourFeature

Create a Pull Request

📄 License

MIT License © 2025
