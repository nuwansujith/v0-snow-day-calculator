"use client"

import type React from "react"

import { useState } from "react"
import { Snowflake, ThermometerSnowflake, Wind } from "lucide-react"

import { calculateSnowDayProbability } from "@/lib/snow-day-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface SnowDayResult {
  probability: number
  temperature: number
  snowfall: number
  windSpeed: number
  message: string
}

export function SnowDayCalculator() {
  const [postalCode, setPostalCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SnowDayResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!postalCode.trim()) {
      setError("Please enter a postal code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would be an API call to a weather service
      // For demo purposes, we're using a simulated function
      const data = await calculateSnowDayProbability(postalCode)
      setResult(data)
    } catch (err) {
      setError("Unable to calculate snow day probability. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-2 border-blue-100 bg-white/80 shadow-lg backdrop-blur-sm dark:border-blue-900 dark:bg-slate-900/80">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-blue-800 dark:text-blue-300">Check Your Location</CardTitle>
          <CardDescription className="text-center">
            Enter your postal code to check the snow day forecast
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="border-blue-200 focus-visible:ring-blue-500 dark:border-blue-800"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Calculate Snow Day Probability"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-blue-100 bg-white/80 shadow-lg backdrop-blur-sm dark:border-blue-900 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-800 dark:text-blue-300">Snow Day Forecast</CardTitle>
            <CardDescription className="text-center">Based on weather predictions for your area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-blue-600 dark:text-blue-400">{result.probability}%</div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Chance of a Snow Day</p>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{result.message}</p>
            </div>

            <Progress value={result.probability} className="h-3 bg-blue-100 dark:bg-blue-950" />

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <ThermometerSnowflake className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Temperature</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{result.temperature}°F</span>
              </div>

              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Snowflake className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Snowfall</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{result.snowfall}" expected</span>
              </div>

              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Wind className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Wind Speed</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{result.windSpeed} mph</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-blue-100 pt-4 dark:border-blue-900">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Last updated: {new Date().toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
