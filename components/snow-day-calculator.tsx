"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Snowflake, ThermometerSnowflake, Wind } from "lucide-react"

import { calculateSnowDayProbability } from "@/app/actions/weather"
import type { SnowDayResult } from "@/app/actions/weather"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

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
    setResult(null)

    try {
      const data = await calculateSnowDayProbability(postalCode)
      setResult(data)
    } catch (err) {
      console.error("Error:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Unable to calculate snow day probability. Please try again with a valid postal code.",
      )
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
                placeholder="Enter postal code (e.g., 10001 or M5V 2H1)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="border-blue-200 focus-visible:ring-blue-500 dark:border-blue-800"
              />
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="border-2 border-blue-100 bg-white/80 shadow-lg backdrop-blur-sm dark:border-blue-900 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-800 dark:text-blue-300">Snow Day Forecast</CardTitle>
            <CardDescription className="text-center">
              For {result.location} - {result.conditions}
            </CardDescription>
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
                <span className="text-lg font-bold text-slate-800 dark:text-white">
                  {result.snowfall > 0 ? `${result.snowfall}" expected` : "None expected"}
                </span>
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
