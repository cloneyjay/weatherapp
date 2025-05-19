"use client"

import type React from "react"

import { useState, useCallback } from "react"
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  CloudRain,
  Compass,
  SunMedium,
  Cloud,
  CloudSnow,
  CloudLightning,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useWeather } from "@/hooks/use-weather"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { useApi } from "@/contexts/api-context"
import { ApiStatus } from "@/components/api-status"

export default function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [unit, setUnit] = useState("celsius")

  const { apiBaseUrl } = useApi()
  const { weatherData, loading, error, fetchWeatherForCity, fetchWeatherForCurrentLocation } = useWeather()

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        fetchWeatherForCity(searchQuery)
      }
    },
    [searchQuery, fetchWeatherForCity],
  )

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <SunMedium className="h-16 w-16" />
      case "cloud":
        return <Cloud className="h-16 w-16" />
      case "rain":
        return <CloudRain className="h-16 w-16" />
      case "snow":
        return <CloudSnow className="h-16 w-16" />
      case "storm":
        return <CloudLightning className="h-16 w-16" />
      default:
        return <SunMedium className="h-16 w-16" />
    }
  }

  const formatTemp = (temp: number) => {
    return unit === "celsius" ? `${temp}°C` : `${temp}°F`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6">
          {/* Header with API status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-3">Weather App</h1>
              <ApiStatus />
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search city..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={fetchWeatherForCurrentLocation}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                <Compass className="h-4 w-4 mr-2" />
                Current Location
              </Button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error.message}
              code={error.code}
              onRetry={() =>
                weatherData?.location
                  ? fetchWeatherForCity(weatherData.location.name)
                  : fetchWeatherForCurrentLocation()
              }
            />
          )}

          {loading ? (
            <LoadingSpinner />
          ) : weatherData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Weather */}
              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center">
                  {getWeatherIcon(weatherData.current.icon)}
                  <h1 className="text-5xl font-bold mt-4">
                    {unit === "celsius" ? weatherData.current.temp : weatherData.current.tempF}°
                  </h1>
                  <p className="text-xl mt-2">{weatherData.current.condition}</p>
                  <div className="flex items-center mt-4 text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p>
                      {weatherData.location.name}, {weatherData.location.country}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                {/* Temperature Unit Switch */}
                <div className="flex justify-end mb-4">
                  <Tabs defaultValue="celsius" value={unit} onValueChange={setUnit}>
                    <TabsList>
                      <TabsTrigger value="celsius">°C</TabsTrigger>
                      <TabsTrigger value="fahrenheit">°F</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* 3-Day Forecast */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {weatherData.forecast.map((day, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 flex flex-col items-center">
                        <p className="text-sm font-medium mb-2">{day.day}</p>
                        {getWeatherIcon(day.icon)}
                        <p className="mt-2 text-sm">
                          {formatTemp(unit === "celsius" ? day.tempMin : day.tempMinF)} /{" "}
                          {formatTemp(unit === "celsius" ? day.tempMax : day.tempMaxF)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{day.condition}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Additional Weather Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Wind Status</h3>
                        <Wind className="h-4 w-4 text-gray-500" />
                      </div>
                      <p className="text-2xl font-bold">{weatherData.current.wind} km/h</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Compass className="h-4 w-4 mr-1" />
                        <span>WSW</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Humidity</h3>
                        <Droplets className="h-4 w-4 text-gray-500" />
                      </div>
                      <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                      <Progress value={weatherData.current.humidity} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Precipitation</h3>
                        <CloudRain className="h-4 w-4 text-gray-500" />
                      </div>
                      <p className="text-2xl font-bold">{weatherData.current.precipitation} mm</p>
                      <p className="text-sm text-gray-500 mt-2">Chance: {weatherData.forecast[0].precipitation}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Feels Like</h3>
                        <SunMedium className="h-4 w-4 text-gray-500" />
                      </div>
                      <p className="text-2xl font-bold">
                        {unit === "celsius"
                          ? weatherData.current.feelsLike
                          : Math.round((weatherData.current.feelsLike * 9) / 5 + 32)}
                        °
                      </p>
                      <p className="text-sm text-gray-500 mt-2">UV Index: {weatherData.current.uv}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Server className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Weather Data</h3>
                <p className="text-gray-500 mb-4">
                  Search for a city or use your current location to see the weather forecast.
                </p>
                <Button onClick={fetchWeatherForCurrentLocation} disabled={loading}>
                  <Compass className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </CardContent>
            </Card>
          )}

          {/* API Info */}
          {apiBaseUrl && (
            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Connected to: {apiBaseUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
