/**
 * Application configuration
 */
const config = {
  /**
   * API URLs
   */
  api: {
    /**
     * Laravel backend API base URL
     */
    laravelBaseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  },

  /**
   * Weather configuration
   */
  weather: {
    /**
     * Default city to show if geolocation fails
     */
    defaultCity: "Nairobi",

    /**
     * Cache duration in milliseconds (10 minutes)
     */
    cacheDuration: 10 * 60 * 1000,
  },
}

export default config