import { trackUsage } from '@/api/usage'

export function useUsageTracking() {
  const startTimeMap = new Map<string, number>()

  const startTracking = (toolId: string) => {
    startTimeMap.set(toolId, Date.now())
  }

  const stopTracking = async (toolId: string) => {
    const startTime = startTimeMap.get(toolId)
    if (!startTime) return

    const duration = Date.now() - startTime
    startTimeMap.delete(toolId)

    try {
      await trackUsage({
        toolId,
        duration,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to track usage:', error)
    }
  }

  return {
    startTracking,
    stopTracking,
  }
}
