interface SimulationData {
  time: number;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  energy?: number;
  [key: string]: any;
}

export const exportToCSV = (data: SimulationData[], filename: string) => {
  if (data.length === 0) return;

  // Create CSV header
  const headers = ['Time', 'Position_X', 'Position_Y', 'Position_Z', 'Velocity_X', 'Velocity_Y', 'Velocity_Z', 'Energy'];
  
  // Create CSV rows
  const rows = data.map(d => [
    d.time.toFixed(4),
    d.position.x.toFixed(4),
    d.position.y.toFixed(4),
    d.position.z.toFixed(4),
    d.velocity.x.toFixed(4),
    d.velocity.y.toFixed(4),
    d.velocity.z.toFixed(4),
    (d.energy || 0).toFixed(4)
  ]);

  // Combine headers and rows
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Download file
  downloadFile(csv, `${filename}.csv`, 'text/csv');
};

export const exportToJSON = (data: SimulationData[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, 'application/json');
};

export const exportSimulationConfig = (simulation: any, filename: string) => {
  const config = {
    name: simulation.name,
    type: simulation.type,
    parameters: simulation.parameters,
    exportedAt: new Date().toISOString()
  };
  
  const json = JSON.stringify(config, null, 2);
  downloadFile(json, `${filename}_config.json`, 'application/json');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
