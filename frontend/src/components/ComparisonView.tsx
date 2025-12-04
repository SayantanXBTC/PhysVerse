import { useState } from 'react';
import { SimulationType } from '@/types';
import SimulationCanvas from './SimulationCanvas';
import { ArrowLeftRight } from 'lucide-react';

interface ComparisonConfig {
  left: {
    type: SimulationType;
    parameters: Record<string, any>;
    name: string;
  };
  right: {
    type: SimulationType;
    parameters: Record<string, any>;
    name: string;
  };
}

interface Props {
  config: ComparisonConfig;
  isRunning: boolean;
}

export default function ComparisonView({ config, isRunning }: Props) {
  const [syncedTime, setSyncedTime] = useState(true);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ArrowLeftRight size={20} className="text-primary-500" />
          <span className="font-semibold">Comparison Mode</span>
        </div>
        
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={syncedTime}
            onChange={(e) => setSyncedTime(e.target.checked)}
            className="rounded"
          />
          <span>Sync Time</span>
        </label>
      </div>

      {/* Split View */}
      <div className="flex-1 flex">
        {/* Left Simulation */}
        <div className="flex-1 flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <div className="text-sm font-medium">{config.left.name}</div>
            <div className="text-xs text-gray-400 capitalize">
              {config.left.type.replace('-', ' ')}
            </div>
          </div>
          <div className="flex-1">
            <SimulationCanvas
              type={config.left.type}
              parameters={config.left.parameters}
              isRunning={isRunning}
            />
          </div>
        </div>

        {/* Right Simulation */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <div className="text-sm font-medium">{config.right.name}</div>
            <div className="text-xs text-gray-400 capitalize">
              {config.right.type.replace('-', ' ')}
            </div>
          </div>
          <div className="flex-1">
            <SimulationCanvas
              type={config.right.type}
              parameters={config.right.parameters}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>

      {/* Parameter Differences */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
        <div className="text-sm font-medium mb-2">Parameter Differences</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            {Object.entries(config.left.parameters).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1">
                <span className="text-gray-400">{key}:</span>
                <span className="font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
          <div>
            {Object.entries(config.right.parameters).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1">
                <span className="text-gray-400">{key}:</span>
                <span className="font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
