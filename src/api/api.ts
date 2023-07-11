import { Farm, Fertilizer } from '../models'

const API_URL =
  'https://1827942140233013.cn-hongkong.fc.aliyuncs.com/2016-08-15/proxy/candidate-test.LATEST'

const request = async (path: string, option?: any) => {
  const result = await fetch(`${API_URL}/${path}`, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    },
    ...option
  })
  return await result.json()
}

export const getFarm = async (): Promise<{ data: Farm[] }> => {
  return await request('farm/')
}

export const getFertilizer = async (farmId: string): Promise<{ data: Fertilizer }> => {
  return await request(`fertilizer/${farmId}`)
}
