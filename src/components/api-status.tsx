"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { useApi } from "@/contexts/api-context"

export function ApiStatus() {
  const { apiBaseUrl, isConnected, checkingConnection } = useApi()

  if (checkingConnection) {
    return (
      <div className="flex items-center text-xs text-gray-500">
        <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
        Checking API...
      </div>
    )
  }

  return (
    <div className="flex items-center text-xs">
      {isConnected ? (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          <span>API Connected</span>
        </div>
      ) : (
        <div className="flex items-center text-red-600">
          <XCircle className="h-3 w-3 mr-1" />
          <span>API {apiBaseUrl ? "Not Connected" : "Not Configured"}</span>
        </div>
      )}
    </div>
  )
}
