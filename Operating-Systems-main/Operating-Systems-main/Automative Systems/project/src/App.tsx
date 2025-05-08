import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  Cpu,
  Activity,
  AlertTriangle,
  Shield,
  Timer,
  Layers,
  Bell,
  Gauge,
  Thermometer,
  Battery,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Process {
  id: number;
  name: string;
  priority: number;
  state: 'running' | 'ready' | 'blocked';
  cpuTime: number;
  memory: number;
  arrivalTime: number;
}

interface Interrupt {
  id: number;
  type: string;
  timestamp: string;
  status: 'pending' | 'handled';
  priority: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  temperature: number;
  processes: Process[];
  interrupts: Interrupt[];
}

type SchedulingAlgorithm = 'Priority' | 'FCFS';

function Dashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    temperature: 0,
    processes: [],
    interrupts: []
  });

  const [schedulingAlgorithm, setSchedulingAlgorithm] = useState<SchedulingAlgorithm>('Priority');

  const scheduleProcesses = (processes: Process[], algorithm: SchedulingAlgorithm): Process[] => {
    const scheduledProcesses = [...processes];
    
    // Set all processes to ready state initially
    scheduledProcesses.forEach(p => {
      if (p.state !== 'blocked') {
        p.state = 'ready';
      }
    });

    // Find the next process to run based on the scheduling algorithm
    const readyProcesses = scheduledProcesses.filter(p => p.state !== 'blocked');
    
    if (readyProcesses.length > 0) {
      let selectedProcess: Process;
      
      if (algorithm === 'Priority') {
        // Priority scheduling: select process with highest priority (lowest number)
        selectedProcess = readyProcesses.reduce((prev, current) => 
          prev.priority < current.priority ? prev : current
        );
      } else { // FCFS
        // First Come First Serve: select process with earliest arrival time
        selectedProcess = readyProcesses.reduce((prev, current) => 
          prev.arrivalTime < current.arrivalTime ? prev : current
        );
      }

      // Set the selected process to running state
      const index = scheduledProcesses.findIndex(p => p.id === selectedProcess.id);
      if (index !== -1) {
        scheduledProcesses[index].state = 'running';
      }
    }

    return scheduledProcesses;
  };

  useEffect(() => {
    const simulateMetrics = () => {
      const baseProcesses: Process[] = [
        {
          id: 1,
          name: 'Engine Control',
          priority: 1,
          state: 'ready',
          cpuTime: Math.random() * 100,
          memory: Math.random() * 512,
          arrivalTime: 1
        },
        {
          id: 2,
          name: 'Sensor Monitor',
          priority: 2,
          state: 'ready',
          cpuTime: Math.random() * 100,
          memory: Math.random() * 256,
          arrivalTime: 2
        },
        {
          id: 3,
          name: 'Navigation',
          priority: 3,
          state: 'ready',
          cpuTime: Math.random() * 100,
          memory: Math.random() * 1024,
          arrivalTime: 3
        },
        {
          id: 4,
          name: 'Climate Control',
          priority: 2,
          state: 'ready',
          cpuTime: Math.random() * 100,
          memory: Math.random() * 128,
          arrivalTime: 4
        }
      ];

      // Schedule processes based on selected algorithm
      const scheduledProcesses = scheduleProcesses(baseProcesses, schedulingAlgorithm);

      const interrupts: Interrupt[] = [
        {
          id: 1,
          type: 'Hardware',
          timestamp: new Date().toISOString(),
          status: 'handled',
          priority: 1
        },
        {
          id: 2,
          type: 'Software',
          timestamp: new Date().toISOString(),
          status: 'pending',
          priority: 2
        }
      ];

      setMetrics({
        cpuUsage: 30 + Math.random() * 40,
        memoryUsage: 40 + Math.random() * 30,
        temperature: 60 + Math.random() * 20,
        processes: scheduledProcesses,
        interrupts
      });
    };

    const interval = setInterval(simulateMetrics, 1000);
    return () => clearInterval(interval);
  }, [schedulingAlgorithm]); // Re-run effect when scheduling algorithm changes

  const cpuData = {
    labels: Array.from({ length: 30 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'CPU Usage',
        data: Array.from({ length: 30 }, () => Math.random() * 100),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Cpu className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Vehicle OS Dashboard</h1>
              <p className="text-gray-400">System Monitor and Process Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={schedulingAlgorithm}
              onChange={(e) => setSchedulingAlgorithm(e.target.value as SchedulingAlgorithm)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2"
            >
              <option value="Priority">Priority Scheduling</option>
              <option value="FCFS">First Come First Serve</option>
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">CPU Usage</h2>
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {metrics.cpuUsage.toFixed(1)}%
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Memory Usage</h2>
              <Layers className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {metrics.memoryUsage.toFixed(1)}%
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Active Processes</h2>
              <Timer className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {metrics.processes.length}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">System Temperature</h2>
              <Thermometer className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {metrics.temperature.toFixed(1)}°C
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Process Control Block (PCB)</h2>
              <div className="text-sm text-gray-400">
                Current Algorithm: {schedulingAlgorithm}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-2 text-left">PID</th>
                    <th className="py-2 text-left">Process</th>
                    {schedulingAlgorithm === 'Priority' && (
                      <th className="py-2 text-left">Priority</th>
                    )}
                    <th className="py-2 text-left">State</th>
                    <th className="py-2 text-left">CPU Time</th>
                    <th className="py-2 text-left">Memory</th>
                    <th className="py-2 text-left">Arrival Time</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.processes.map((process) => (
                    <tr key={process.id} className="border-b border-gray-700">
                      <td className="py-2">{process.id}</td>
                      <td className="py-2">{process.name}</td>
                      {schedulingAlgorithm === 'Priority' && (
                        <td className="py-2">{process.priority}</td>
                      )}
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          process.state === 'running' ? 'bg-green-500/20 text-green-400' :
                          process.state === 'ready' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {process.state}
                        </span>
                      </td>
                      <td className="py-2">{process.cpuTime.toFixed(2)}ms</td>
                      <td className="py-2">{process.memory.toFixed(2)}MB</td>
                      <td className="py-2">{process.arrivalTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Interrupt Handler</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-2 text-left">ID</th>
                    <th className="py-2 text-left">Type</th>
                    <th className="py-2 text-left">Priority</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.interrupts.map((interrupt) => (
                    <tr key={interrupt.id} className="border-b border-gray-700">
                      <td className="py-2">{interrupt.id}</td>
                      <td className="py-2">{interrupt.type}</td>
                      <td className="py-2">{interrupt.priority}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          interrupt.status === 'handled' ? 'bg-green-500/20 text-green-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {interrupt.status}
                        </span>
                      </td>
                      <td className="py-2">{new Date(interrupt.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">CPU Usage History</h2>
            <div className="h-[300px]">
              <Line options={chartOptions} data={cpuData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;