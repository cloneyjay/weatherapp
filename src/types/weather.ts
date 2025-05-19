export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp: number
    tempF: number
    condition: string
    icon: string
    wind: number
    humidity: number
    precipitation: number
    feelsLike: number
    uv: number
  }
  forecast: ForecastDay[]
  lastUpdated: string
}

export interface ForecastDay {
  date: string
  day: string
  tempMin: number
  tempMax: number
  tempMinF: number
  tempMaxF: number
  icon: string
  condition: string
  precipitation: number
}

export interface WeatherError {
  message: string
  code?: number
}
