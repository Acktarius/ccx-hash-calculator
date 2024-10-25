import React from 'react';
import { RigData, GPU } from '../types';
import gpuData from '../data/gpuData.json';

interface RigSummaryProps {
  rigData: RigData;
  selectedNvidiaGpus: Record<string, number>;
  selectedAmdGpus: Record<string, number>;
  usingFallbackData: boolean;
}

const RigSummary: React.FC<RigSummaryProps> = ({
  rigData,
  selectedNvidiaGpus,
  selectedAmdGpus,
  usingFallbackData,
}) => {
  const calculateBrandHashrate = (
    selectedGpus: Record<string, number>,
    brand: 'nvidia' | 'amd'
  ): number => {
    return Object.entries(selectedGpus).reduce((total, [gpuName, count]) => {
      const gpu = (gpuData[brand] as GPU[]).find((g) => g.name === gpuName);
      return total + (gpu ? gpu.hashrate * count : 0);
    }, 0);
  };

  const renderSelectedGpus = (gpus: Record<string, number>, brand: string) => {
    const selected = Object.entries(gpus);
    if (selected.length === 0) return null;
    const totalBrandHashrate = calculateBrandHashrate(
      gpus,
      brand.toLowerCase() as 'nvidia' | 'amd'
    );
    return (
      <div className="gpu-column">
        <div className={brand.toLocaleLowerCase()}>
          <h3>{brand}</h3>
          <ul>
            {selected.map(([name, count]) => (
              <li key={name}>
                {name}: {count}
              </li>
            ))}
            <li className="total-hashrate">
              <strong>sub total: {totalBrandHashrate.toFixed(2)} KH/s</strong>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="rig-summary">
      <h2>Rig Summary</h2>
      <div className="gpu-columns">
        {renderSelectedGpus(selectedNvidiaGpus, 'NVIDIA')}
        {renderSelectedGpus(selectedAmdGpus, 'AMD')}
      </div>
      <div className="rig-stats">
        <p>
          <span>Total Hashrate:</span>
          <strong>{rigData.totalHashrate.toFixed(2)} KH/s</strong>
        </p>
        <p>
          <span>Total Power Consumption:</span>
          <strong>{rigData.totalPower.toFixed(0)} W</strong>
        </p>
        <p>
          <span>Estimated CCX Mined per Day:</span>
          <strong>
            {rigData.estimatedCoinsPerDay.toFixed(2)} CCX
            {usingFallbackData && ' (using fallback data)'}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default RigSummary;
