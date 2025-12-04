# PhysVerse Enhancement Integration Guide

## Quick Start: Adding New Features

This guide shows you exactly how to integrate the 8 new enhancement features into your existing PhysVerse application.

## Prerequisites

Install required packages:

```bash
cd frontend
npm install chart.js react-chartjs-2 react-hot-toast @headlessui/react
```

## 1. Data Visualization (Graphs) 📊

### Step 1: Update package.json dependencies
Already created the component. Now integrate it.

### Step 2: Modify SimulationEditorPage.tsx

Add after the existing imports:
```typescript
import SimulationGraphs from '@/components/SimulationGraphs';
import { BarChart3 } from 'lucide-react';
```

Add state for graph data and visibility:
```typescript
const [showGraphs, setShowGraphs] = useState(false);
const [graphData, setGraphData] = useState<any[]>([]);
```

Add toggle button in the header section:
```typescript
<button
  onClick={() => setShowGraphs(!showGraphs)}
  className="btn btn-secondary flex items-center space-x-2"
>
  <BarChart3 size={18} />
  <span>Graphs</span>
</button>
```

Add graphs panel below the main content:
```typescript
{showGraphs && (
  <div className="border-t border-gray-700 p-4">
    <SimulationGraphs data={graphData} isVisible={showGraphs} />
  </div>
)}
```

## 2. Data Export 💾

### Modify SimulationControls.tsx

Add imports:
```typescript
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToJSON, exportSimulationConfig } from '@/utils/exportData';
```

Add export section in the controls:
```typescript
<div className="border-t border-gray-700 pt-4 mt-4">
  <h3 className="text-sm font-semibold mb-2">Export Data</h3>
  <div className="space-y-2">
    <button
      onClick={() => exportToCSV(simulationData, 'simulation-data')}
      className="w-full btn btn-secondary flex items-center justify-center space-x-2"
    >
      <FileSpreadsheet size={16} />
      <span>Export CSV</span>
    </button>
    <button
      onClick={() => exportToJSON(simulationData, 'simulation-data')}
      className="w-full btn btn-secondary flex items-center justify-center space-x-2"
    >
      <FileJson size={16} />
      <span>Export JSON</span>
    </button>
  </div>
</div>
```

## 3. Simulation Presets 🎯

### Modify SimulationControls.tsx

Add import:
```typescript
import { simulationPresets, getPresetsByType } from '@/data/simulationPresets';
```

Add preset selector after simulation type:
```typescript
{isNew && (
  <div>
    <label className="block text-sm font-medium mb-2">Load Preset</label>
    <select
      onChange={(e) => {
        const preset = simulationPresets.find(p => p.id === e.target.value);
        if (preset) {
          setType(preset.type);
          setParameters(preset.parameters);
        }
      }}
      className="input"
    >
      <option value="">-- Select Preset --</option>
      {getPresetsByType(type).map(preset => (
        <option key={preset.id} value={preset.id}>
          {preset.name}
        </option>
      ))}
    </select>
    <p className="text-xs text-gray-400 mt-1">
      Quick start with pre-configured simulations
    </p>
  </div>
)}
```

## 4. Keyboard Shortcuts ⌨️

### Modify SimulationEditorPage.tsx

Add import:
```typescript
import { useKeyboardShortcuts, simulationEditorShortcuts } from '@/hooks/useKeyboardShortcuts';
```

Add hook after other hooks:
```typescript
useKeyboardShortcuts(
  simulationEditorShortcuts(
    isRunning,
    setIsRunning,
    () => {
      // Reset logic
      setIsRunning(false);
      // Reset parameters to defaults
    },
    handleSave
  ),
  true
);
```

Add keyboard shortcuts help button:
```typescript
import { Keyboard } from 'lucide-react';

<button
  onClick={() => setShowShortcuts(true)}
  className="btn btn-secondary"
  title="Keyboard Shortcuts"
>
  <Keyboard size={18} />
</button>
```

## 5. Recording & Playback 🎬

### Modify SimulationEditorPage.tsx

Add import:
```typescript
import { useSimulationRecorder } from '@/hooks/useSimulationRecorder';
import { Circle, Play, Square, Download } from 'lucide-react';
```

Add recorder hook:
```typescript
const recorder = useSimulationRecorder();
```

Add recording controls in header:
```typescript
<div className="flex items-center space-x-2 border-l border-gray-700 pl-4">
  {!recorder.isRecording ? (
    <button
      onClick={recorder.startRecording}
      className="btn btn-secondary flex items-center space-x-2"
    >
      <Circle size={16} className="text-red-500" />
      <span>Record</span>
    </button>
  ) : (
    <button
      onClick={recorder.stopRecording}
      className="btn btn-secondary flex items-center space-x-2"
    >
      <Square size={16} />
      <span>Stop ({recorder.frameCount})</span>
    </button>
  )}
  
  {recorder.frameCount > 0 && (
    <>
      <button
        onClick={recorder.startPlayback}
        disabled={recorder.isPlaying}
        className="btn btn-secondary"
      >
        <Play size={16} />
      </button>
      <button
        onClick={recorder.exportRecording}
        className="btn btn-secondary"
      >
        <Download size={16} />
      </button>
    </>
  )}
</div>
```

## 6. Camera Controls 📷

### Modify SimulationCanvas.tsx

Replace the OrbitControls import and usage:
```typescript
import { SmoothOrbitControls } from './CameraControls';

// In the Canvas component, replace:
<OrbitControls makeDefault />

// With:
<SmoothOrbitControls />
```

## 7. Performance Monitor 📈

### Modify App.tsx or Layout.tsx

Add import:
```typescript
import PerformanceMonitor from '@/components/PerformanceMonitor';
```

Add component at the root level:
```typescript
<PerformanceMonitor />
```

## 8. Comparison Mode 🔄

### Create new page: ComparisonPage.tsx

```typescript
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ComparisonView from '@/components/ComparisonView';
import { SimulationType } from '@/types';

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const [isRunning, setIsRunning] = useState(false);

  const config = {
    left: {
      type: SimulationType.PROJECTILE,
      parameters: { velocity: 20, angle: 45, gravity: 9.8 },
      name: 'Earth Gravity'
    },
    right: {
      type: SimulationType.PROJECTILE,
      parameters: { velocity: 20, angle: 45, gravity: 1.62 },
      name: 'Moon Gravity'
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Simulation Comparison</h1>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn btn-primary"
          >
            {isRunning ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
      <ComparisonView config={config} isRunning={isRunning} />
    </div>
  );
}
```

Add route in App.tsx:
```typescript
<Route path="/compare" element={<ComparisonPage />} />
```

## Complete Integration Checklist

### Phase 1: Basic Integration (1-2 hours)
- [ ] Install npm packages
- [ ] Add PerformanceMonitor to Layout
- [ ] Add keyboard shortcuts to editor
- [ ] Add camera controls to canvas
- [ ] Test basic functionality

### Phase 2: UI Enhancements (2-3 hours)
- [ ] Add graphs toggle and panel
- [ ] Add export buttons
- [ ] Add preset selector
- [ ] Style new components
- [ ] Test responsiveness

### Phase 3: Advanced Features (3-4 hours)
- [ ] Implement recording controls
- [ ] Create comparison page
- [ ] Add keyboard shortcuts help modal
- [ ] Add tooltips
- [ ] Test all features together

### Phase 4: Polish (1-2 hours)
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success notifications
- [ ] Update documentation
- [ ] Final testing

## Testing Checklist

After integration, test:
- [ ] Graphs display correctly
- [ ] Export downloads files
- [ ] Presets load parameters
- [ ] Keyboard shortcuts work
- [ ] Recording captures frames
- [ ] Camera presets work
- [ ] Performance monitor shows FPS
- [ ] Comparison mode displays both simulations
- [ ] No console errors
- [ ] Mobile responsive

## Troubleshooting

### Charts not displaying
```bash
npm install --save-dev @types/chart.js
```

### TypeScript errors
Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["chart.js"]
  }
}
```

### Performance issues
- Limit graph data points to last 100
- Reduce trail length in simulations
- Disable graphs when not visible

## Next Steps

After basic integration:
1. Add notifications (react-hot-toast)
2. Add modals (@headlessui/react)
3. Implement user preferences
4. Add more presets
5. Create tutorial/onboarding

## Quick Commands

```bash
# Install all dependencies
cd frontend && npm install chart.js react-chartjs-2 react-hot-toast @headlessui/react

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## Support

If you encounter issues:
1. Check console for errors
2. Verify all imports are correct
3. Ensure packages are installed
4. Check TypeScript types
5. Review component props

---

**Ready to enhance!** Start with Phase 1 and work your way through. Each feature is independent and can be added incrementally.
