"use server"

import { z } from "zod"

// Define the response type for our weather data
export interface WeatherData {
  temperature: number // in Fahrenheit
  snowfall: number // in inches
  windSpeed: number // in mph
  conditions: string // weather condition description
  location: string // location description
}

export interface SnowDayResult {
  probability: number
  temperature: number
  snowfall: number
  windSpeed: number
  message: string
  location: string
  conditions: string
}

// Schema for postal code validation
const postalCodeSchema = z.string().min(3).max(10)

// US postal code to region mapping
const usPostalCodeToRegion: Record<string, string> = {
  "0": "New England",
  "1": "New York/New Jersey",
  "2": "Mid-Atlantic",
  "3": "Southeast",
  "4": "Great Lakes",
  "5": "Midwest",
  "6": "South Central",
  "7": "South Central",
  "8": "Mountain",
  "9": "West Coast",
}

// Canadian postal code to province mapping (first letter)
const canadianPostalCodeToRegion: Record<string, string> = {
  A: "Newfoundland",
  B: "Nova Scotia",
  C: "Prince Edward Island",
  E: "New Brunswick",
  G: "Quebec (East)",
  H: "Quebec (Montreal)",
  J: "Quebec (West)",
  K: "Ontario (East)",
  L: "Ontario (Central)",
  M: "Ontario (Toronto)",
  N: "Ontario (Southwest)",
  P: "Ontario (North)",
  R: "Manitoba",
  S: "Saskatchewan",
  T: "Alberta",
  V: "British Columbia",
  X: "Northwest Territories/Nunavut",
  Y: "Yukon",
}

// Weather conditions by region and temperature
function getWeatherConditions(region: string, temperature: number): string {
  // Northern regions
  if (
    ["New England", "Great Lakes", "Midwest", "Mountain", "Manitoba", "Saskatchewan", "Alberta", "Yukon"].includes(
      region,
    ) &&
    temperature < 32
  ) {
    if (temperature < 15) return "Heavy snow"
    if (temperature < 25) return "Light snow"
    return "Snow flurries"
  }

  // Mid regions
  if (
    [
      "New York/New Jersey",
      "Mid-Atlantic",
      "Ontario (North)",
      "Ontario (East)",
      "Quebec (East)",
      "Quebec (West)",
    ].includes(region) &&
    temperature < 35
  ) {
    if (temperature < 20) return "Snow showers"
    if (temperature < 30) return "Light snow"
    return "Freezing rain"
  }

  // Southern/Western regions
  if (temperature < 32) {
    if (temperature < 25) return "Unusual snowfall"
    return "Cold and cloudy"
  }

  // Default conditions based on temperature
  if (temperature < 40) return "Cold and overcast"
  if (temperature < 50) return "Chilly with rain"
  return "Cool and partly cloudy"
}

// Get location description from postal code
function getLocationFromPostalCode(postalCode: string): string {
  // Clean up postal code
  const cleanPostalCode = postalCode.replace(/\s+/g, "").toUpperCase()

  // Check if it's a Canadian postal code (letter-number-letter format)
  if (/^[A-Z]\d[A-Z]/.test(cleanPostalCode)) {
    const firstLetter = cleanPostalCode[0]
    const region = canadianPostalCodeToRegion[firstLetter] || "Canada"
    return `Postal Code ${cleanPostalCode}, ${region}`
  }

  // US ZIP code
  const prefix = cleanPostalCode[0]
  const region = usPostalCodeToRegion[prefix] || "United States"
  return `ZIP Code ${cleanPostalCode}, ${region}`
}

export async function getWeatherByPostalCode(postalCode: string): Promise<WeatherData> {
  try {
    // Validate postal code
    postalCodeSchema.parse(postalCode)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate deterministic "random" data based on postal code
    const seed = sumChars(postalCode)
    const random = seedRandom(seed)

    // Get location based on postal code
    const location = getLocationFromPostalCode(postalCode)

    // Determine region for weather patterns
    let region = "United States"

    // Extract region from location
    const locationParts = location.split(", ")
    if (locationParts.length > 1) {
      region = locationParts[1]
    }

    // Generate temperature based on region
    let baseTemp = 32 // Freezing point as default

    // Adjust base temperature by region
    if (["Southeast", "South Central", "West Coast"].includes(region)) {
      baseTemp = 45
    } else if (
      ["New England", "Great Lakes", "Midwest", "Mountain", "Yukon", "Northwest Territories/Nunavut"].includes(region)
    ) {
      baseTemp = 20
    } else if (["Manitoba", "Saskatchewan", "Alberta", "Quebec"].includes(region)) {
      baseTemp = 15
    }

    // Add some randomness to temperature
    const temperature = Math.round(baseTemp + (random() * 20 - 10))

    // Generate snowfall based on temperature and region
    let snowfall = 0
    if (temperature < 32) {
      // More snow in colder regions
      const snowMultiplier = [
        "New England",
        "Great Lakes",
        "Midwest",
        "Mountain",
        "Manitoba",
        "Saskatchewan",
        "Alberta",
        "Yukon",
      ].includes(region)
        ? 1.5
        : 1.0
      snowfall = Number.parseFloat((random() * 8 * snowMultiplier).toFixed(1))
    }

    // Generate wind speed
    const windSpeed = Math.round(5 + random() * 25)

    // Get weather conditions based on region and temperature
    const conditions = getWeatherConditions(region, temperature)

    return {
      temperature,
      snowfall,
      windSpeed,
      conditions,
      location,
    }
  } catch (error) {
    console.error("Error generating weather data:", error)
    throw new Error("Failed to generate weather data. Please check your postal code and try again.")
  }
}

export async function calculateSnowDayProbability(postalCode: string): Promise<SnowDayResult> {
  // Get simulated weather data
  const weatherData = await getWeatherByPostalCode(postalCode)

  // Calculate probability based on conditions
  let probability = 0

  // Temperature factor (colder = higher probability)
  if (weatherData.temperature < 10) {
    probability += 40
  } else if (weatherData.temperature < 20) {
    probability += 30
  } else if (weatherData.temperature < 28) {
    probability += 20
  } else if (weatherData.temperature < 32) {
    probability += 10
  }

  // Snowfall factor
  if (weatherData.snowfall > 8) {
    probability += 50
  } else if (weatherData.snowfall > 5) {
    probability += 40
  } else if (weatherData.snowfall > 3) {
    probability += 30
  } else if (weatherData.snowfall > 1) {
    probability += 20
  } else if (weatherData.snowfall > 0) {
    probability += 10
  }

  // Wind factor
  if (weatherData.windSpeed > 25) {
    probability += 10
  } else if (weatherData.windSpeed > 15) {
    probability += 5
  }

  // Weather conditions factor
  const conditionsLower = weatherData.conditions.toLowerCase()
  if (conditionsLower.includes("heavy snow") || conditionsLower.includes("blizzard")) {
    probability += 20
  } else if (conditionsLower.includes("snow")) {
    probability += 15
  } else if (conditionsLower.includes("freezing")) {
    probability += 10
  }

  // Cap at 100%
  probability = Math.min(probability, 100)

  // Generate message based on probability
  let message = ""
  if (probability >= 90) {
    message = "Almost certain! Get your sled ready!"
  } else if (probability >= 70) {
    message = "Very likely! Plan for a day off school."
  } else if (probability >= 50) {
    message = "Good chance! Keep your fingers crossed."
  } else if (probability >= 30) {
    message = "There's hope, but don't count on it."
  } else {
    message = "Not looking likely. Better finish your homework."
  }

  return {
    probability,
    temperature: weatherData.temperature,
    snowfall: weatherData.snowfall,
    windSpeed: weatherData.windSpeed,
    message,
    location: weatherData.location,
    conditions: weatherData.conditions,
  }
}

// Helper functions to generate consistent "random" numbers based on postal code
function sumChars(str: string): number {
  return str.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function seedRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}
