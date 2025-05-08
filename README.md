
# 🚗 Automotive Systems Dashboard

A Real-Time Operating System (RTOS) simulation dashboard that visually represents process scheduling and system monitoring as used in modern vehicle control systems like Engine Control Units (ECUs), Adaptive Cruise Control, and Infotainment systems.

![Dashboard Screenshot](./Automative%20systems.jpg)

---

## 🔧 Project Overview

This dashboard provides an interactive interface that simulates RTOS components such as:
- **CPU & Memory Usage**
- **Active Processes**
- **System Temperature**
- **Process Control Block (PCB) Table**
- **Interrupt Handlers**
- **CPU Usage Graph (History)**

Built for educational and demonstration purposes, this system provides insights into how real-time scheduling works in embedded automotive environments.

---

## 🧠 RTOS in Automotive Systems

Modern vehicles rely on RTOS to manage concurrent tasks like:
- **Engine Control**
- **Sensor Monitoring**
- **Navigation**
- **Climate Control**
- **Safety Features** (e.g., Airbag Deployment)

The RTOS ensures:
- **Timely execution** of critical tasks
- **Priority Scheduling** for emergency handling
- **Smooth integration** of infotainment and safety systems

---

## 📁 Key Features

- **Live Dashboard View** of core system metrics.
- **Process Control Block** simulation with priority/state/memory/arrival.
- **Interrupt Handler** status updates (hardware/software).
- **Dynamic Graph** of CPU usage over time.
- **Scheduling Algorithm Toggle** (e.g., Priority Scheduling).

---

## 🧱 Tech Stack

| Tech          | Description                      |
|---------------|----------------------------------|
| **React.js**  | Frontend Framework               |
| **TypeScript**| Type Safety                      |
| **TailwindCSS** | Responsive styling             |
| **Chart.js / Recharts** | Graphical representations |
| **Vite**      | Fast build tool + hot reload     |

---

## 🗂️ Folder Structure

```
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── PCBTable.tsx
│   │   ├── InterruptHandler.tsx
│   │   └── CPUGraph.tsx
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 How to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/automotive-rtos-dashboard.git
   cd automotive-rtos-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the App**
   ```bash
   npm run dev
   ```

4. Visit: `http://localhost:5173`

---

## 🔮 Future Enhancements

- Add support for multiple scheduling algorithms (Round Robin, EDF)
- Simulate inter-process communication (IPC)
- Add unit test coverage for components
- Enable REST API data ingestion

---
