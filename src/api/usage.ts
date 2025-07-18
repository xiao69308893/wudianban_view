import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface UsageData {
  toolId: string
  duration: number
  timestamp: string
}

export const trackUsage = async (data: UsageData): Promise<void> => {
  await axios.post(`${API_BASE_URL}/usage`, data)
}
