'use client'

import React from 'react'
import { TripAnalysis } from '@/app/types'
import { MetricCard, MetricGrid } from './MetricCard'
import {
  AlertCircle,
  Clock,
  Fuel,
  MapPin,
  Navigation,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react'

interface TripAnalysisCardProps {
  analysis: TripAnalysis;
  startLocation: string;
  destination: string;
  currency?: string;
  onViewDetails?: () => void;
}

export function TripAnalysisCard({
  analysis,
  startLocation,
  destination,
  currency = 'PKR',
  onViewDetails,
}: TripAnalysisCardProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  };

  const renderWarningBanner = () => {
    if (analysis.warningLevel === 'critical') {
      return (
        <div className="mb-6 p-4 bg-alert-50 dark:bg-alert-900/20 border border-alert-200 dark:border-alert-800 rounded-lg flex gap-3">
          <AlertTriangle className="w-5 h-5 text-alert-600 dark:text-alert-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-alert-900 dark:text-alert-100">
              ⚠️ Refuel Required
            </p>
            <p className="text-sm text-alert-700 dark:text-alert-300 mt-1">
              You may not have enough fuel to safely complete this trip. Consider
              refueling before departure.
            </p>
          </div>
        </div>
      );
    }

    if (analysis.warningLevel === 'warning') {
      return (
        <div className="mb-6 p-4 bg-alert-50 dark:bg-alert-900/20 border border-alert-200 dark:border-alert-800 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-alert-600 dark:text-alert-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-alert-900 dark:text-alert-100">
              Low Fuel Reserve
            </p>
            <p className="text-sm text-alert-700 dark:text-alert-300 mt-1">
              Your safety buffer is low. Consider refueling along the route.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Trip Route Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{startLocation}</span>
            </div>
            <div className="flex items-center justify-center my-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <Navigation className="w-4 h-4 text-brand-500 mx-2" />
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{destination}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {renderWarningBanner()}

      {/* Main Metrics */}
      <MetricGrid columns={2}>
        <MetricCard
          label="Distance"
          value={analysis.distance.toFixed(0)}
          unit="km"
          icon={<MapPin className="w-5 h-5" />}
        />
        <MetricCard
          label="Estimated Travel Time"
          value={formatDurationShort(analysis.estimatedDuration)}
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          label="Traffic Delay"
          value={formatDurationShort(analysis.trafficDelay)}
          trend="up"
          trendValue="additional time"
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          label="Est. Arrival"
          value={formatTime(analysis.estimatedArrival)}
          icon={<Clock className="w-5 h-5" />}
        />
      </MetricGrid>

      {/* Fuel Analysis */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-sm uppercase tracking-wide">
          Fuel Analysis
        </h3>
        <MetricGrid columns={2}>
          <MetricCard
            label="Fuel Required"
            value={analysis.fuelRequired.toFixed(1)}
            unit="L"
            icon={<Fuel className="w-5 h-5" />}
          />
          <MetricCard
            label="Estimated Cost"
            value={formatCurrency(analysis.fuelCost)}
            icon={<TrendingDown className="w-5 h-5" />}
          />
          <MetricCard
            label="Fuel Remaining"
            value={analysis.fuelRemaining.toFixed(1)}
            unit="L"
            success={analysis.hasSufficientFuel}
            warning={!analysis.hasSufficientFuel}
            icon={<Fuel className="w-5 h-5" />}
          />
          <MetricCard
            label="Est. Mileage"
            value={analysis.estimatedMileage.toFixed(1)}
            unit="km/L"
            icon={<Fuel className="w-5 h-5" />}
          />
        </MetricGrid>
      </div>

      {/* Efficiency Metrics */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-sm uppercase tracking-wide">
          Trip Efficiency
        </h3>
        <MetricGrid columns={2}>
          <MetricCard
            label="Cost per km"
            value={analysis.costPerKm.toFixed(2)}
            unit={`${currency}/km`}
          />
          <MetricCard
            label="Estimated Range"
            value={analysis.range.toFixed(0)}
            unit="km"
          />
          <MetricCard
            label="Safety Margin"
            value={analysis.safetyMargin.toFixed(1)}
            unit="L"
          />
          <MetricCard
            label="Start with Fuel"
            value={analysis.recommendedStartFuel.toFixed(1)}
            unit="L"
            success={true}
          />
        </MetricGrid>
      </div>

      {/* Action Button */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full btn btn-primary btn-lg"
        >
          View Detailed Analysis
        </button>
      )}
    </div>
  );
}

function formatDurationShort(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
