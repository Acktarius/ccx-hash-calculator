import { useState, useEffect } from 'react';
import './App.css';
import Banner from './components/Banner';
import GpuSelector from './components/GpuSelector';
import RigSummary from './components/RigSummary';
import BottomBanner from './components/BottomBanner';
import Footer from './components/Footer';
import { GPU, RigData } from './types';
import { calculateRigData } from './utils/calculations';
import gpuData from './data/gpuData.json';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedNvidiaGpus, setSelectedNvidiaGpus] = useState<Record<string, number>>({});
  const [selectedAmdGpus, setSelectedAmdGpus] = useState<Record<string, number>>({});
  const [rigData, setRigData] = useState<RigData>({
    totalHashrate: 0,
    totalPower: 0,
    estimatedCoinsPerDay: 0,
  });
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  useEffect(() => {
    const updateRigData = async () => {
      try {
        const { data: updatedRigData, usingFallbackData } = await calculateRigData(selectedNvidiaGpus, selectedAmdGpus);
        setRigData(updatedRigData);
        setUsingFallbackData(usingFallbackData);
      } catch (error) {
        console.error("Error updating rig data:", error);
      }
    };
    updateRigData();
  }, [selectedNvidiaGpus, selectedAmdGpus]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <Banner darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <div className="gpu-selectors">
          <GpuSelector
            brand="NVIDIA"
            gpus={gpuData.nvidia as GPU[]}
            selectedGpus={selectedNvidiaGpus}
            setSelectedGpus={setSelectedNvidiaGpus}
          />
          <GpuSelector
            brand="AMD"
            gpus={gpuData.amd as GPU[]}
            selectedGpus={selectedAmdGpus}
            setSelectedGpus={setSelectedAmdGpus}
          />
        </div>
        <RigSummary
          rigData={rigData}
          selectedNvidiaGpus={selectedNvidiaGpus}
          selectedAmdGpus={selectedAmdGpus}
          usingFallbackData={usingFallbackData}
        />
        <p className="small-print">
          Keep in mind that actual performance may vary depending on specific
          hardware configurations (overclock), cooling solutions, and
          optimizations applied by miner.
        </p>
      </main>
      <BottomBanner />
      <Footer />
    </div>
  );
}

export default App;