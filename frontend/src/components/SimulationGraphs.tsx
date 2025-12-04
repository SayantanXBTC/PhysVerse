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

interface DataPoint {
  time: number;
  position: number;
  velocity: number;
  energy: number;
}

interface Props {
  data: DataPoint[];
  isVisible: boolean;
}

export default function SimulationGraphs({ data, isVisible }: Props) {
  if (!isVisible || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d.time.toFixed(2)),
    datasets: [
      {
        label: 'Position (m)',
        data: data.map(d => d.position),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Velocity (m/s)',
        data: data.map(d => d.velocity),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Energy (J)',
        data: data.map(d => d.energy),
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.5)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Simulation Data Over Time',
        color: '#fff'
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      }
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}
