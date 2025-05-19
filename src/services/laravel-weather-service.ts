import type { WeatherData, WeatherError } from "@/types/weather"

// Function to fetch weather data for a city
export async function fetchWeatherForCity(city: string): Promise<WeatherData> {
  try {
    // Check if we have cached data that's less than 10 minutes old
    const cachedData = getCachedWeatherData(city)
    if (cachedData) {
      return cachedData
    }

    // Use the Next.js API route as a proxy to avoid CORS issues
    const response = await fetch(`/api/weather/city?city=${encodeURIComponent(city)}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw {
        message: errorData.message || "Failed to fetch weather data",
        code: response.status,
      }
    }

    const data = await response.json()
    
    // Cache the data
    cacheWeatherData(city, data)

    return data
  } catch (error: any) {
    console.error("Error fetching weather data:", error)
    throw {
      message: error.message || "An error occurred",
      code: error.code || 500
    }
  }
}

// Function to fetch weather data by coordinates
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  try {
    // Check if we have cached data that's less than 10 minutes old
    const cacheKey = `coords_${lat}_${lon}`
    const cachedData = getCachedWeatherData(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // Use the Next.js API route as a proxy to avoid CORS issues
    const response = await fetch(`/api/weather/coordinates?lat=${lat}&lon=${lon}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw {
        message: errorData.message || "Failed to fetch weather data",
        code: response.status,
      }
    }

    const data = await response.json()
    
    // Cache the data
    cacheWeatherData(cacheKey, data)

    return data
  } catch (error: any) {
    console.error("Error fetching weather by coordinates:", error)
    throw {
      message: error.message || "An error occurred",
      code: error.code || 500
    }
  }
}

// Function to get user's location using browser geolocation
export function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ message: "Geolocation is not supported by your browser" })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        reject({
          message: "Unable to retrieve your location",
          code: error.code,
        })
      },
    )
  })
}

// Cache functions
function getCachedWeatherData(key: string): WeatherData | null {
  try {
    const cachedData = localStorage.getItem(`weather_${key.toLowerCase()}`)
    if (!cachedData) return null

    const parsedData = JSON.parse(cachedData)
    const cacheTime = new Date(parsedData.lastUpdated).getTime()
    const now = new Date().getTime()

    // Cache expires after 10 minutes (600000 ms)
    if (now - cacheTime > 600000) {
      localStorage.removeItem(`weather_${key.toLowerCase()}`)
      return null
    }

    return parsedData
  } catch (e) {
    return null
  }
}

function cacheWeatherData(key: string, data: WeatherData): void {
  try {
    localStorage.setItem(`weather_${key.toLowerCase()}`, JSON.stringify(data))
  } catch (e) {
    console.error("Error caching weather data:", e)
  }
}