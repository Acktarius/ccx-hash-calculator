import { GPU, RigData } from '../types';
import gpuData from '../data/gpuData.json';

declare const $: any; // Declare jQuery to avoid TypeScript errors

const BLOCK_TIME = 120; // seconds
const BLOCK_REWARD = 6.0; // CCX
const FALLBACK_DIFFICULTY = 55000000; // Fallback difficulty if API fails

interface NetworkData {
  difficulty: number;
  networkHashrate: number;
}

async function fetchNetworkData(): Promise<NetworkData> {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://explorer.conceal.network/daemon/getinfo',
      method: 'GET',
      dataType: 'json',
      success: function (data: any) {
        if (!data || typeof data.difficulty !== 'number') {
          reject(new Error('Invalid data received from API'));
          return;
        }

        const difficulty = data.difficulty;
        const networkHashrate = difficulty / BLOCK_TIME;

        resolve({
          difficulty: difficulty,
          networkHashrate: networkHashrate,
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        reject(new Error(`API request failed: ${textStatus}, ${errorThrown}`));
      },
    });
  });
}

function calculateEstimatedCoinsPerDay(
  rigHashrate: number,
  networkData: NetworkData
): number {
  const blocksPerDay = (24 * 60 * 60) / BLOCK_TIME;
  const dailyReward = blocksPerDay * BLOCK_REWARD;
  const rigHashrateShare = (rigHashrate * 1000) / networkData.networkHashrate; // using KH/s
  return dailyReward * rigHashrateShare;
}

export async function calculateRigData(
  selectedNvidiaGpus: Record<string, number>,
  selectedAmdGpus: Record<string, number>
): Promise<{ data: RigData; usingFallbackData: boolean }> {
  let totalRigHashrate = 0;
  let totalPower = 0;

  const calculateForBrand = (
    selectedGpus: Record<string, number>,
    brand: 'nvidia' | 'amd'
  ) => {
    Object.entries(selectedGpus).forEach(([gpuName, count]) => {
      const gpu = (gpuData[brand] as GPU[]).find((g) => g.name === gpuName);
      if (gpu) {
        totalRigHashrate += gpu.hashrate * count;
        totalPower += gpu.power * count;
      }
    });
  };

  calculateForBrand(selectedNvidiaGpus, 'nvidia');
  calculateForBrand(selectedAmdGpus, 'amd');

  let networkData: NetworkData;
  let usingFallbackData = false;

  try {
    networkData = await fetchNetworkData();
  } catch (error) {
    console.error('Error fetching network data, using fallback values:', error);
    networkData = {
      difficulty: FALLBACK_DIFFICULTY,
      networkHashrate: FALLBACK_DIFFICULTY / BLOCK_TIME,
    };
    usingFallbackData = true;
  }

  const estimatedCoinsPerDay = calculateEstimatedCoinsPerDay(
    totalRigHashrate,
    networkData
  );

  return {
    data: {
      totalHashrate: totalRigHashrate,
      totalPower,
      estimatedCoinsPerDay,
    },
    usingFallbackData,
  };
}
