'use client'

import React from 'react'

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  warning?: boolean;
  success?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  unit,
  trend,
  trendValue,
  warning = false,
  success = false,
  onClick,
  className = '',
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl p-4 sm:p-6 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        ${warning
          ? 'bg-alert-50 dark:bg-alert-900/20 border border-alert-200 dark:border-alert-800'
          : success
          ? 'bg-fuel-50 dark:bg-fuel-900/20 border border-fuel-200 dark:border-fuel-800'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
        }
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label text-slate-600 dark:text-slate-400">
            {label}
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="metric-value">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>

          {trend && trendValue && (
            <div className={`
              text-xs font-medium mt-2
              ${trend === 'up' ? 'text-alert-600 dark:text-alert-400' : ''}
              ${trend === 'down' ? 'text-fuel-600 dark:text-fuel-400' : ''}
              ${trend === 'neutral' ? 'text-slate-600 dark:text-slate-400' : ''}
            `}>
              {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
            </div>
          )}
        </div>

        {icon && (
          <div className={`
            p-3 rounded-lg
            ${warning
              ? 'bg-alert-100 dark:bg-alert-900/40 text-alert-600 dark:text-alert-400'
              : success
              ? 'bg-fuel-100 dark:bg-fuel-900/40 text-fuel-600 dark:text-fuel-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }
          `}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

interface MetricGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({
  children,
  columns = 2,
  className = '',
}: MetricGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-4 ${gridClass} ${className}`}>
      {children}
    </div>
  )
}
