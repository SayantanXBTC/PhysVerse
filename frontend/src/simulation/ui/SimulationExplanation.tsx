import { Info } from 'lucide-react';

interface SimulationExplanationProps {
  title: string;
  description: string;
  keyPoints: string[];
  physicsLaw?: string;
}

export default function SimulationExplanation({ 
  title, 
  description, 
  keyPoints, 
  physicsLaw 
}: SimulationExplanationProps) {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 space-y-3">
      <div className="flex items-start space-x-2">
        <Info className="text-blue-400 mt-0.5 flex-shrink-0" size={18} />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-300 mb-1">{title}</h4>
          <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>

      {keyPoints.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400">What to observe:</p>
          <ul className="space-y-1">
            {keyPoints.map((point, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {physicsLaw && (
        <div className="pt-2 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 italic">{physicsLaw}</p>
        </div>
      )}
    </div>
  );
}
