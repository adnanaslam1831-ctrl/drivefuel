/**
 * API Route: /api/fuel-logs
 * Track fuel purchases and consumption
 */

import { NextRequest, NextResponse } from 'next/server'

// In-memory database for demo
const fuelLogsDatabase: any[] = []

export async function GET() {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehicleId = searchParams.get('vehicleId')

    // Filter by vehicle if specified
    let logs = fuelLogsDatabase
    if (vehicleId) {
      logs = logs.filter((log) => log.vehicleId === vehicleId)
    }

    // Sort by date descending
    logs.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
    })
  } catch (error) {
    console.error('Fuel log retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve fuel logs' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const body = await request.json()

    const {
      vehicleId,
      date,
      location,
      liters,
      cost,
      pricePer,
      odometer,
      notes,
    } = body

    // Validate required fields
    if (!vehicleId || !liters || !cost || !pricePer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amounts
    if (liters <= 0 || cost <= 0 || pricePer <= 0) {
      return NextResponse.json(
        { error: 'All amounts must be greater than 0' },
        { status: 400 }
      )
    }

    // Create fuel log
    const fuelLog = {
      id: `fuellog_${Date.now()}`,
      vehicleId,
      date: date || new Date().toISOString(),
      location,
      liters,
      cost,
      pricePer,
      odometer,
      notes,
      createdAt: new Date().toISOString(),
    }

    fuelLogsDatabase.push(fuelLog)

    return NextResponse.json({
      success: true,
      data: fuelLog,
      message: 'Fuel log recorded successfully',
    })
  } catch (error) {
    console.error('Fuel log creation error:', error)
    return NextResponse.json(
      { error: 'Failed to record fuel log' },
      { status: 500 }
    )
  }
}
