/**
 * API Route: /api/analytics
 * User trip and fuel analytics
 */

import { NextRequest, NextResponse } from 'next/server'

// Mock data access (in production, query from database)
const tripsDatabase: any[] = []
const fuelLogsDatabase: any[] = []
const vehiclesDatabase: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehicleId = searchParams.get('vehicleId')

    // Filter trips
    let trips = tripsDatabase
    if (vehicleId) {
      trips = trips.filter((t) => t.vehicleId === vehicleId)
    }

    // Filter fuel logs
    let fuelLogs = fuelLogsDatabase
    if (vehicleId) {
      fuelLogs = fuelLogs.filter((f) => f.vehicleId === vehicleId)
    }

    // Calculate metrics
    const totalDistance = trips.reduce((sum, t) => sum + (t.distance || 0), 0)
    const totalFuelCost = fuelLogs.reduce((sum, f) => sum + (f.cost || 0), 0)
    const totalLiters = fuelLogs.reduce((sum, f) => sum + (f.liters || 0), 0)
    const avgMileage = totalLiters > 0 ? totalDistance / totalLiters : 0

    // Calculate by vehicle
    const vehicleStats = vehiclesDatabase.map((vehicle) => {
      const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id)
      const vehicleLogs = fuelLogs.filter((f) => f.vehicleId === vehicle.id)

      const distance = vehicleTrips.reduce((sum, t) => sum + (t.distance || 0), 0)
      const cost = vehicleLogs.reduce((sum, f) => sum + (f.cost || 0), 0)
      const liters = vehicleLogs.reduce((sum, f) => sum + (f.liters || 0), 0)
      const mileage = liters > 0 ? distance / liters : 0

      return {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        trips: vehicleTrips.length,
        distance: Math.round(distance * 100) / 100,
        cost: Math.round(cost * 100) / 100,
        liters: Math.round(liters * 100) / 100,
        avgMileage: Math.round(mileage * 100) / 100,
        costPerKm: distance > 0 ? Math.round((cost / distance) * 100) / 100 : 0,
      }
    })

    // Group by month
    const monthlyData: { [key: string]: any } = {}
    trips.forEach((trip) => {
      const date = new Date(trip.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: key,
          trips: 0,
          distance: 0,
          cost: 0,
          liters: 0,
        }
      }

      monthlyData[key].trips++
      monthlyData[key].distance += trip.distance || 0
      monthlyData[key].cost += trip.fuelCost || 0

      // Add fuel for this trip
      const tripLogs = fuelLogs.filter(
        (f) =>
          new Date(f.date).getFullYear() === date.getFullYear() &&
          new Date(f.date).getMonth() === date.getMonth()
      )
      monthlyData[key].liters += tripLogs.reduce((sum, f) => sum + f.liters, 0)
    })

    const monthlyStats = Object.values(monthlyData).sort((a: any, b: any) =>
      b.month.localeCompare(a.month)
    )

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalTrips: trips.length,
          totalDistance: Math.round(totalDistance * 100) / 100,
          totalCost: Math.round(totalFuelCost * 100) / 100,
          totalLiters: Math.round(totalLiters * 100) / 100,
          avgMileage: Math.round(avgMileage * 100) / 100,
          costPerKm:
            totalDistance > 0
              ? Math.round((totalFuelCost / totalDistance) * 100) / 100
              : 0,
          avgTripDistance:
            trips.length > 0
              ? Math.round((totalDistance / trips.length) * 100) / 100
              : 0,
          avgTripCost:
            trips.length > 0
              ? Math.round((totalFuelCost / trips.length) * 100) / 100
              : 0,
        },
        byVehicle: vehicleStats,
        monthly: monthlyStats,
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    )
  }
}
