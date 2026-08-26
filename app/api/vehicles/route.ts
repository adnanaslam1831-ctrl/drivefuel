/**
 * API Route: /api/vehicles
 * Manage user vehicles
 */

import { NextRequest, NextResponse } from 'next/server'

// In-memory database for demo
const vehiclesDatabase: any[] = []

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: vehiclesDatabase,
      count: vehiclesDatabase.length,
    })
  } catch (error) {
    console.error('Vehicle retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve vehicles' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const body = await request.json()

    const {
      name,
      vehicleType,
      manufacturer,
      model,
      year,
      fuelType,
      averageMileage,
      tankCapacity,
      currentFuel,
      fuelPrice,
      engineSize,
      horsepower,
      transmission,
      batteryCapacity,
      evRange,
      chargingCost,
    } = body

    // Validate required fields
    if (!name || !vehicleType || !fuelType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate mileage
    if (!averageMileage || averageMileage <= 0) {
      return NextResponse.json(
        { error: 'Average mileage must be greater than 0' },
        { status: 400 }
      )
    }

    // Create vehicle record
    const vehicle = {
      id: `vehicle_${Date.now()}`,
      name,
      vehicleType,
      manufacturer,
      model,
      year,
      fuelType,
      averageMileage,
      tankCapacity,
      currentFuel,
      fuelPrice,
      engineSize,
      horsepower,
      transmission,
      batteryCapacity,
      evRange,
      chargingCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vehiclesDatabase.push(vehicle)

    return NextResponse.json({
      success: true,
      data: vehicle,
      message: 'Vehicle added successfully',
    })
  } catch (error) {
    console.error('Vehicle creation error:', error)
    return NextResponse.json(
      { error: 'Failed to add vehicle' },
      { status: 500 }
    )
  }
}
