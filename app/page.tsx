'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { TripPlanner } from './components/TripPlanner'
import { TripAnalysisCard } from './components/TripAnalysisCard'
import { MetricCard } from './components/MetricCard'
import {
  Navigation,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Fuel,
  Clock,
  MapPin,
} from 'lucide-react'
import { TripAnalysis } from '@/app/types'

export default function Home() {
  const [tripAnalysis, setTripAnalysis] = useState<TripAnalysis | null>(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [tripData, setTripData] = useState<any>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <Fuel className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50">
              DriveFuel
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/features"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/auth/signin"
              className="btn btn-secondary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!tripAnalysis ? (
        <section className="py-12 sm:py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Know Your Trip Before You Drive
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400">
                    Calculate fuel consumption, travel time, cost, and driving
                    plan in seconds. Drive smarter, not faster.
                  </p>
                </div>

                <button
                  onClick={() => setShowPlanner(true)}
                  className="btn btn-primary btn-lg w-full sm:w-auto"
                >
                  Plan My Trip
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-brand-500">
                      1M+
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Trips Planned
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-fuel-500">
                      45%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Cost Saved
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-alert-500">
                      180+
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Countries
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Preview Cards */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-6 bg-gradient-to-br from-brand-50 to-brand-50/30 dark:from-brand-900/20 dark:to-brand-900/5 border border-brand-200 dark:border-brand-800/30">
                    <Fuel className="w-8 h-8 text-brand-600 dark:text-brand-400 mb-2" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Accurate Fuel
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      24.4 L needed
                    </p>
                  </div>
                  <div className="rounded-xl p-6 bg-gradient-to-br from-fuel-50 to-fuel-50/30 dark:from-fuel-900/20 dark:to-fuel-900/5 border border-fuel-200 dark:border-fuel-800/30">
                    <TrendingDown className="w-8 h-8 text-fuel-600 dark:text-fuel-400 mb-2" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Smart Savings
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      PKR 6,588 cost
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-6 bg-gradient-to-br from-alert-50 to-alert-50/30 dark:from-alert-900/20 dark:to-alert-900/5 border border-alert-200 dark:border-alert-800/30">
                    <Clock className="w-8 h-8 text-alert-600 dark:text-alert-400 mb-2" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Traffic-Aware
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      4h 32m estimated
                    </p>
                  </div>
                  <div className="rounded-xl p-6 bg-gradient-to-br from-slate-50 to-slate-50/30 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Shield className="w-8 h-8 text-slate-600 dark:text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Safety First
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Smart alerts
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <section className="space-y-12 py-12 border-t border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Complete Trip Intelligence
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                  Everything you need to know about your journey before you leave.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      ) : (
        /* Trip Analysis Results */
        <section className="py-12 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <button
                onClick={() => setTripAnalysis(null)}
                className="flex items-center gap-2 text-brand-500 hover:text-brand-600 font-medium"
              >
                ← Back to Planner
              </button>
            </div>

            <TripAnalysisCard
              analysis={tripAnalysis}
              startLocation={tripData?.startLocation || ''}
              destination={tripData?.destination || ''}
              onViewDetails={() => {
                // Navigate to detailed analysis
              }}
            />
          </div>
        </section>
      )}

      {/* Trip Planner Modal */}
      {showPlanner && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Plan Your Trip
              </h2>
              <button
                onClick={() => setShowPlanner(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <TripPlanner
                onAnalysisReady={(analysis, data) => {
                  setTripAnalysis(analysis);
                  setTripData(data);
                  setShowPlanner(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Fuel className="w-5 h-5 text-brand-500" />
                <span className="font-bold text-slate-900 dark:text-slate-50">
                  DriveFuel
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Know your trip before you drive.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/features" className="hover:text-slate-900 dark:hover:text-slate-50">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-slate-50">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-slate-900 dark:hover:text-slate-50">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-50">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-slate-900 dark:hover:text-slate-50">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-slate-900 dark:hover:text-slate-50">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-50">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-50">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 DriveFuel. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: <Fuel className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
    title: 'Accurate Fuel Calculation',
    description:
      'Real-world fuel consumption based on traffic, road conditions, and driving style.',
  },
  {
    icon: <Clock className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
    title: 'Traffic-Aware ETA',
    description:
      'Live traffic data integrated with your route for accurate arrival times.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
    title: 'Smart Route Options',
    description:
      'Compare routes by fuel consumption, time, and cost to find the best option.',
  },
  {
    icon: <Shield className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
    title: 'Safety Guidance',
    description:
      'Safe speed recommendations and alerts to keep you safe on the road.',
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
    title: 'EV Ready',
    description: 'Full support for electric vehicles with battery and charging calculations.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
    title: 'Trip Analytics',
    description:
      'Track fuel consumption, costs, and efficiency across all your journeys.',
  },
];

import { TrendingDown } from 'lucide-react';
