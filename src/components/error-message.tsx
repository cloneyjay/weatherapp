"use client"

import { AlertCircle, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  code?: number
}

export function ErrorMessage({ message, onRetry, code }: ErrorMessageProps) {
  // Display a special message for API connection errors
  if (code === 0 || code === 404 || code === 500) {
    return (
      <Alert variant="destructive" className="mb-6">
        <Server className="h-4 w-4" />
        <AlertTitle>API Connection Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>
            {code === 404
              ? "The requested resource was not found."
              : code === 500
                ? "The server encountered an error."
                : "Could not connect to the weather API."}
          </p>
          <p className="text-sm">Details: {message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="self-start mt-2">
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="self-start mt-2">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
