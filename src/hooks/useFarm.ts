import { useState, useCallback, useEffect, useRef } from 'react'
import { getFarm, getFertilizer } from '../api/api'
import { Farm, Fertilizer } from '../models'

export const useFarm = () => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [fertilizer, setFertilizer] = useState<Fertilizer>()
  const [currentFarmId, setCurrentFarmId] = useState<string>('')

  const cacheData = useRef<Map<string, any>>(new Map())

  const fetchFram = useCallback(async () => {
    try {
      const { data } = await getFarm()
      if (data.length > 0) {
        setCurrentFarmId(data[0].id)
      }
      setFarms(data)
    } catch (e) {
      console.log(e)
    }
  }, [])

  const onChangeFarm = useCallback(async (framId: string) => {
    try {
      if (cacheData.current.has(framId)) {
        setFertilizer(cacheData.current.get(framId))
      } else {
        const { data } = await getFertilizer(framId)
        data.locations.forEach((item, index) => {
          item.id = `${framId}-${index}`
        })
        cacheData.current.set(framId, data)
        setFertilizer(data)
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    fetchFram()
  }, [fetchFram])

  useEffect(() => {
    if (currentFarmId) {
      onChangeFarm(currentFarmId)
    }
  }, [currentFarmId, onChangeFarm])

  return {
    farms,
    fertilizer,
    currentFarmId,
    onChangeFarm,
    setCurrentFarmId
  }
}
