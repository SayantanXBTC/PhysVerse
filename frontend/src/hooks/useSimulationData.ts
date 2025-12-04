import { useState, useEffect, useCallback } from 'react';

interface DataPoint {
  time: number;
  [key: string]: number;
}

export function useSimulationData(maxPoints: number = 100) {
  const [data, setData] = useState<DataPoint[]>([]);

  const addDataPoint = useCallback((point: DataPoint) => {
    setData(prev => {
      const newData = [...prev, point];
      // Keep only the last maxPoints
      return newData.slice(-maxPoints);
    });
  }, [maxPoints]);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  return { data, addDataPoint, clearData };
}
