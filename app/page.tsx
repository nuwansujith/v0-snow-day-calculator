import { SnowDayCalculator } from "@/components/snow-day-calculator"
import { SnowfallAnimation } from "@/components/snowfall-animation"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <SnowfallAnimation />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-800 dark:text-white md:text-5xl">
              Snow Day Calculator
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">Find out if you'll have a snow day tomorrow!</p>
          </div>
          <SnowDayCalculator />
        </div>
      </div>
    </main>
  )
}
