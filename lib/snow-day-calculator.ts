// This is a simulated function that would normally call a weather API
// In a real application, you would use a weather API to get actual forecast data

interface SnowDayResult {
  probability: number
  temperature: number
  snowfall: number
  windSpeed: number
  message: string
}

export async function calculateSnowDayProbability(postalCode: string): Promise<SnowDayResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate random weather data based on postal code
  // In a real app, this would come from a weather API
  const seed = sumChars(postalCode)
  const random = seedRandom(seed)

  // Generate weather conditions
  const temperature = Math.floor(random() * 35) - 5 // -5°F to 30°F
  const snowfall = Number.parseFloat((random() * 12).toFixed(1)) // 0-12 inches
  const windSpeed = Math.floor(random() * 30) + 5 // 5-35 mph

  // Calculate probability based on conditions
  let probability = 0

  // Temperature factor (colder = higher probability)
  if (temperature < 10) {
    probability += 40
  } else if (temperature < 20) {
    probability += 30
  } else if (temperature < 28) {
    probability += 20
  } else {
    probability += 10
  }

  // Snowfall factor
  if (snowfall > 8) {
    probability += 50
  } else if (snowfall > 5) {
    probability += 40
  } else if (snowfall > 3) {
    probability += 30
  } else if (snowfall > 1) {
    probability += 20
  } else {
    probability += 10
  }

  // Wind factor
  if (windSpeed > 25) {
    probability += 10
  } else if (windSpeed > 15) {
    probability += 5
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
    temperature,
    snowfall,
    windSpeed,
    message,
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
