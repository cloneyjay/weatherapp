"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import config from "@/config"

interface ApiContextType {
  apiBaseUrl: string
  isConnected: boolean
  checkingConnection: boolean
  checkConnection: () => Promise<boolean>
}

const ApiContext = createContext<ApiContextType>({
  apiBaseUrl: "",
  isConnected: false,
  checkingConnection: true,
  checkConnection: async () => false,
})

export const useApi = () => useContext(ApiContext)

export function ApiProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)

  const checkConnection = async (): Promise<boolean> => {
    try {
      setCheckingConnection(true)
      const response = await fetch(`/api/connection-check`)
      const data = await response.json()
      setIsConnected(data.success)
      return data.success
    } catch (error) {
      setIsConnected(false)
      console.error("API connection check error:", error)
      return false
    } finally {
      setCheckingConnection(false)
    }
  }

  useEffect(() => {
    // Check API connection on client-side
    checkConnection()
  }, [])

  const value = {
    apiBaseUrl: config.api.laravelBaseUrl,
    isConnected,
    checkingConnection,
    checkConnection,
  }

  // return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}