import { SimulationParameterDefinition } from '../types';

interface Props {
  parameters: Record<string, SimulationParameterDefinition>;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  disabled?: boolean;
}

export default function DynamicParameterControls({ parameters, values, onChange, disabled }: Props) {
  const renderControl = (key: string, param: SimulationParameterDefinition) => {
    const value = values[key] ?? param.default;

    switch (param.type) {
      case 'number':
        return (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={`${key}-range`} className="text-sm font-medium text-gray-200">
                {param.label}
              </label>
              <span className="text-sm font-mono text-primary-400">
                {typeof value === 'number' ? value.toFixed(2) : String(value)}
              </span>
            </div>
            <input
              id={`${key}-range`}
              type="range"
              min={param.min}
              max={param.max}
              step={param.step || 0.1}
              value={typeof value === 'number' ? value : param.default as number}
              onChange={(e) => onChange(key, parseFloat(e.target.value))}
              disabled={disabled}
              aria-label={param.label}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              id={`${key}-number`}
              type="number"
              min={param.min}
              max={param.max}
              step={param.step || 0.1}
              value={typeof value === 'number' ? value : param.default as number}
              onChange={(e) => onChange(key, parseFloat(e.target.value))}
              disabled={disabled}
              aria-label={`${param.label} value`}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {param.description && (
              <p className="text-xs text-gray-400">{param.description}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-200">
                {param.label}
              </label>
              {param.description && (
                <p className="text-xs text-gray-400 mt-1">{param.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(key, !value)}
              disabled={disabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-primary-600' : 'bg-gray-700'
              }`}
              aria-label={`Toggle ${param.label}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              >
                <span className="sr-only">{value ? 'On' : 'Off'}</span>
              </span>
            </button>
          </div>
        );

      case 'select':
        return (
          <div key={key} className="space-y-2">
            <label htmlFor={`${key}-select`} className="text-sm font-medium text-gray-200">
              {param.label}
            </label>
            <select
              id={`${key}-select`}
              value={value as string}
              onChange={(e) => onChange(key, e.target.value)}
              disabled={disabled}
              aria-label={param.label}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {param.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {param.description && (
              <p className="text-xs text-gray-400">{param.description}</p>
            )}
          </div>
        );

      case 'vector':
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              {param.label}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="X"
                disabled={disabled}
                aria-label={`${param.label} X component`}
                className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Y"
                disabled={disabled}
                aria-label={`${param.label} Y component`}
                className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Z"
                disabled={disabled}
                aria-label={`${param.label} Z component`}
                className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {param.description && (
              <p className="text-xs text-gray-400">{param.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(parameters).map(([key, param]) => renderControl(key, param))}
    </div>
  );
}
