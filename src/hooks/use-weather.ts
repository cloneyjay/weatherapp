"use client"

import { useState, useEffect, useCallback } from "react"
import type { WeatherData, WeatherError } from "@/types/weather"
import { fetchWeatherForCity, fetchWeatherByCoords, getUserLocation } from "@/services/laravel-weather-service"
import config from "@/config"

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<WeatherError | null>(null)

  const fetchWeatherForCityHandler = useCallback(async (city: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchWeatherForCity(city)
      setWeatherData(data)
    } catch (err) {
      setError(err as WeatherError)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWeatherForCurrentLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { lat, lon } = await getUserLocation()
      const data = await fetchWeatherByCoords(lat, lon)
      setWeatherData(data)
    } catch (err) {
      setError(err as WeatherError)
      // Fallback to a default city if geolocation fails
      fetchWeatherForCityHandler(config.weather.defaultCity)
    } finally {
      setLoading(false)
    }
  }, [fetchWeatherForCityHandler])

  // Load weather data for current location on initial render
  useEffect(() => {
    fetchWeatherForCurrentLocation()
  }, [fetchWeatherForCurrentLocation])

  return {
    weatherData,
    loading,
    error,
    fetchWeatherForCity: fetchWeatherForCityHandler,
    fetchWeatherForCurrentLocation,
  }
}
