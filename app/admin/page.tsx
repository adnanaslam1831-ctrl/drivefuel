'use client'

import React, { useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  LogOut,
  RefreshCw,
} from 'lucide-react'

// Chart component
function SimpleChart({ data, title }: { data: any[]; title: string }) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600 dark:text-slate-400">
                {item.label}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-50">
                {item.value}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-500 h-full"
                style={{
                  width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const stats = {
    totalUsers: 1250,
    activeUsers: 324,
    totalTrips: 45820,
    completedTrips: 43215,
    subscriptionRevenue: 12450,
    freeUsers: 890,
    proUsers: 310,
    businessUsers: 50,
  }

  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  const refreshData = () => {
    setLoading(true)
    // Simulate data refresh
    setTimeout(() => setLoading(false), 1000)
  }

  const metricCards = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-100 dark:bg-brand-900/30',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      color: 'text-fuel-600 dark:text-fuel-400',
      bgColor: 'bg-fuel-100 dark:bg-fuel-900/30',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Total Trips',
      value: stats.totalTrips.toLocaleString(),
      color: 'text-alert-600 dark:text-alert-400',
      bgColor: 'bg-alert-100 dark:bg-alert-900/30',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Monthly Revenue',
      value: `₨${stats.subscriptionRevenue.toLocaleString()}`,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-700',
    },
  ]

  const subscriptionData = [
    { label: 'Free Plan', value: stats.freeUsers },
    { label: 'Pro Plan', value: stats.proUsers },
    { label: 'Business Plan', value: stats.businessUsers },
  ]

  const tripData = [
    { label: 'Completed', value: stats.completedTrips },
    { label: 'Planned', value: stats.totalTrips - stats.completedTrips },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">📊</span>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              disabled={loading}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
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
            Analytics & Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Platform metrics and user management
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metricCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div
                className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}
              >
                <div className={card.color}>{card.icon}</div>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <SimpleChart
            data={subscriptionData}
            title="User Distribution by Plan"
          />
          <SimpleChart data={tripData} title="Trip Status Distribution" />
        </div>

        {/* Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Routes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Top Routes
            </h3>
            <div className="space-y-3">
              {[
                { route: 'Islamabad → Lahore', trips: 4520 },
                { route: 'Lahore → Karachi', trips: 3210 },
                { route: 'Islamabad → Peshawar', trips: 2840 },
                { route: 'Karachi → Hyderabad', trips: 2120 },
                { route: 'Lahore → Islamabad', trips: 1950 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.route}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {item.trips.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Vehicles */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Popular Vehicles
            </h3>
            <div className="space-y-3">
              {[
                { vehicle: 'Toyota Corolla', users: 1240 },
                { vehicle: 'Honda Civic', users: 890 },
                { vehicle: 'Suzuki Alto', users: 720 },
                { vehicle: 'Tesla Model 3', users: 340 },
                { vehicle: 'Honda CR-V', users: 280 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.vehicle}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {item.users.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-6">
            System Health
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                API Response Time
              </p>
              <p className="text-2xl font-bold text-fuel-600 dark:text-fuel-400">
                142ms
              </p>
              <p className="text-xs text-fuel-600 dark:text-fuel-400 mt-1">
                ✓ Optimal
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Database Uptime
              </p>
              <p className="text-2xl font-bold text-fuel-600 dark:text-fuel-400">
                99.98%
              </p>
              <p className="text-xs text-fuel-600 dark:text-fuel-400 mt-1">
                ✓ Excellent
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Error Rate
              </p>
              <p className="text-2xl font-bold text-fuel-600 dark:text-fuel-400">
                0.02%
              </p>
              <p className="text-xs text-fuel-600 dark:text-fuel-400 mt-1">
                ✓ Healthy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
