/**
 * API Route: POST /api/trips
 * Calculate and save a trip
 */

import { NextRequest, NextResponse } from 'next/server'

// For now, we'll use in-memory storage for demo
// Replace with Prisma in production
const tripsDatabase: any[] = []

export async function POST() {
  try {
    const body = await request.json()

    const {
      startLocation,
      startLat,
      startLng,
      destination,
      destLat,
      destLng,
      distance,
      duration,
      trafficDelay,
      fuelRequired,
      fuelCost,
      fuelRemaining,
      estimatedMileage,
      estimatedArrival,
      vehicleName,
      vehicleType,
      currentFuel,
      fuelPrice,
    } = body

    // Validate required fields
    if (!startLocation || !destination || !distance) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create trip record
    const trip = {
      id: `trip_${Date.now()}`,
      startLocation,
      startLat,
      startLng,
      destination,
      destLat,
      destLng,
      distance,
      duration,
      trafficDelay,
      fuelRequired,
      fuelCost,
      fuelRemaining,
      estimatedMileage,
      estimatedArrival,
      vehicleName,
      vehicleType,
      currentFuel,
      fuelPrice,
      status: 'planned',
      createdAt: new Date().toISOString(),
    }

    // Save to in-memory database
    tripsDatabase.push(trip)

    return NextResponse.json({
      success: true,
      data: trip,
      message: 'Trip saved successfully',
    })
  } catch (error) {
    console.error('Trip creation error:', error)
    return NextResponse.json(
      { error: 'Failed to save trip' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // In production, filter by userId from session
    return NextResponse.json({
      success: true,
      data: tripsDatabase,
      count: tripsDatabase.length,
    })
  } catch (error) {
    console.error('Trip retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve trips' },
      { status: 500 }
    )
  }
}
