export interface GPU {
  name: string
  hashrate: number // in KH/s
  power: number // in Watts
}

export interface RigData {
  totalHashrate: number
  totalPower: number
  estimatedCoinsPerDay: number
}`to`