import React, { useState } from 'react'
import { GPU } from '../types'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

interface GpuSelectorProps {
  brand: 'NVIDIA' | 'AMD'
  gpus: GPU[]
  selectedGpus: Record<string, number>
  setSelectedGpus: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

const GpuSelector: React.FC<GpuSelectorProps> = ({ brand, gpus, selectedGpus, setSelectedGpus }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded(!expanded)

  const updateGpuCount = (gpuName: string, increment: number) => {
    setSelectedGpus(prev => {
      const currentCount = prev[gpuName] || 0
      const newCount = Math.max(0, currentCount + increment)
      if (newCount === 0) {
        const { [gpuName]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [gpuName]: newCount }
    })
  }

  return (
    <div className={`gpu-selector ${brand.toLowerCase()}`}>
      <h2 onClick={toggleExpanded}>
        {brand} {expanded ? <FaChevronDown /> : <FaChevronRight />}
      </h2>
      {expanded && (
        <ul>
          {gpus.map(gpu => (
            <li key={gpu.name}>
              <span>{gpu.name}</span>
              <div>
                <button onClick={() => updateGpuCount(gpu.name, -1)}>-</button>
                <span>{selectedGpus[gpu.name] || 0}</span>
                <button onClick={() => updateGpuCount(gpu.name, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GpuSelector