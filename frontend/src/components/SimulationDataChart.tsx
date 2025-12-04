import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  time: number;
  [key: string]: number;
}

interface SimulationDataChartProps {
  data: DataPoint[];
  dataKeys: { key: string; color: string; label: string }[];
  title?: string;
  maxPoints?: number;
}

export default function SimulationDataChart({ 
  data, 
  dataKeys, 
  title = 'Real-Time Data',
  maxPoints = 100 
}: SimulationDataChartProps) {
  const [displayData, setDisplayData] = useState<DataPoint[]>([]);

  // Smooth data updates with useMemo to prevent unnecessary recalculations
  const smoothedData = useMemo(() => {
    const slicedData = data.slice(-maxPoints);
    
    // Apply simple moving average for smoother lines
    if (slicedData.length < 3) return slicedData;
    
    return slicedData.map((point, index) => {
      if (index === 0 || index === slicedData.length - 1) return point;
      
      const smoothed: DataPoint = { time: point.time };
      
      dataKeys.forEach(({ key }) => {
        const prev = slicedData[index - 1][key] || 0;
        const curr = point[key] || 0;
        const next = slicedData[index + 1][key] || 0;
        
        // Simple moving average with 3 points
        smoothed[key] = (prev + curr + next) / 3;
      });
      
      return smoothed;
    });
  }, [data, maxPoints, dataKeys]);

  useEffect(() => {
    // Use requestAnimationFrame for smoother updates
    const rafId = requestAnimationFrame(() => {
      setDisplayData(smoothedData);
    });
    
    return () => cancelAnimationFrame(rafId);
  }, [smoothedData]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border-2 border-red-500/30 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="text-red-400" size={24} />
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            label={{ value: 'Value', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #EF4444',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            animationDuration={200}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {dataKeys.map(({ key, color, label }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              name={label}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
