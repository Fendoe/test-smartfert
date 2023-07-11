export interface Farm {
  id: string
  name: string
}

export interface Location {
  geo: number[]
  nit: number
  id?: string
}

export interface Fertilizer {

  locations: Location[]
  total: number
}
