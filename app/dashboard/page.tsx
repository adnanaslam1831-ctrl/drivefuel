'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  BarChart3,
  Clock,
  Fuel,
  MapPin,
  LogOut,
  Plus,
  TrendingDown,
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [trips, setTrips] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Fetch trips
      const tripsRes = await fetch('/api/trips')
      const tripsData = await tripsRes.json()
      setTrips(tripsData.data || [])

      // Fetch analytics
      const analyticsRes = await fetch('/api/analytics')
      const analyticsData = await analyticsRes.json()
      setAnalytics(analyticsData.data?.summary)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <Fuel className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50">
              DriveFuel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="btn btn-secondary text-sm"
            >
              Plan Trip
            </Link>
            <button
              onClick={handleLogout}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your trips and fuel consumption
          </p>
        </div>

        {/* Analytics Grid */}
        {!loading && analytics && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Total Trips
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {analytics.totalTrips || 0}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Total Distance
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {analytics.totalDistance?.toLocaleString() || 0}{' '}
                <span className="text-lg">km</span>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                <Fuel className="w-4 h-4" />
                Total Cost
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                ₨{analytics.totalCost?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                Avg Mileage
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {analytics.avgMileage?.toFixed(1) || 0}{' '}
                <span className="text-lg">km/L</span>
              </p>
            </div>
          </div>
        )}

        {/* Trips Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Recent Trips
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {trips.length} trips recorded
              </p>
            </div>
            <Link
              href="/"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <MapPin className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No trips yet. Plan your first trip!
              </p>
              <Link href="/" className="btn btn-primary">
                Plan My Trip
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <th className="px-6 py-4 text-left">Route</th>
                    <th className="px-6 py-4 text-left">Distance</th>
                    <th className="px-6 py-4 text-left">Duration</th>
                    <th className="px-6 py-4 text-left">Fuel</th>
                    <th className="px-6 py-4 text-left">Cost</th>
                    <th className="px-6 py-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {trips.map((trip, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                          {trip.startLocation} →{' '}
                          {trip.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {trip.distance?.toFixed(0)} km
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.round(trip.duration / 60)} min
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        {trip.fuelRequired?.toFixed(1)} L
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-50">
                        ₨{trip.fuelCost?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
