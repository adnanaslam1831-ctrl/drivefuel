import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DriveFuel - Know Your Trip Before You Drive',
  description: 'Intelligent trip planning with fuel consumption, travel time, and safety analysis. Calculate your route, fuel cost, and arrival time in seconds.',
  keywords: [
    'trip planner',
    'fuel calculator',
    'road trip',
    'travel time',
    'fuel cost',
    'vehicle mileage',
    'EV trip planner',
    'route planner',
  ],
  authors: [{ name: 'DriveFuel' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://drivefuel.app',
    title: 'DriveFuel - Know Your Trip Before You Drive',
    description:
      'Intelligent trip planning with fuel consumption and safety analysis',
    siteName: 'DriveFuel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DriveFuel',
    description: 'Know Your Trip Before You Drive',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
