# DriveFuel Architecture Guide

Complete technical architecture and design patterns for DriveFuel.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Pages (page.tsx, auth, admin, etc)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Components (TripPlanner, MetricCard, etc)               │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬─────────────────┐
        ▼              ▼              ▼                 ▼
   ┌─────────┐  ┌──────────────┐  ┌──────┐  ┌──────────────┐
   │ Services │  │ API Routes   │  │ Auth │  │ External APIs│
   │ (Business│  │ (/api)       │  │      │  │ (Google Maps)│
   │  Logic) │  │              │  │      │  │ (Stripe)     │
   └────┬────┘  └──────┬───────┘  └──┬───┘  └──────────────┘
        │               │             │
        └───────────────┼─────────────┘
                        ▼
                  ┌──────────────┐
                  │  PostgreSQL  │
                  │  Database    │
                  │  (Prisma ORM)│
                  └──────────────┘
```

## 📦 Service Modules

### 1. Fuel Calculations (`services/fuelCalculations.ts`)

**Purpose**: Core algorithm for fuel consumption analysis

**Key Functions**:
- `calculateBaseFuelRequirement()` - Simple distance ÷ mileage
- `adjustFuelConsumption()` - Real-world factors adjustment
- `calculateFuelRequired()` - Complete analysis with buffer
- `calculateRange()` - Remaining driving distance
- `calculateFuelCostBreakdown()` - Cost per km analysis
- `getRealisticMileageAdjustment()` - Official spec correction
- `calculateEVRange()` - Electric vehicle range
- `calculateEVChargingCost()` - Charging costs

**Adjustments Applied**:
```
Base Mileage (14 km/L)
├── Traffic (-15% to +5%)
├── City Driving (-20%)
├── Acceleration Style (±10%)
├── Air Conditioning (-5%)
├── Vehicle Load (±5%)
└── Weather (-5% to -15%)
```

**Safety Buffer**: Default 15% recommended reserve

### 2. Google Maps Service (`services/googleMapsService.ts`)

**Purpose**: Maps integration and location services

**Key Functions**:
- `geocodeAddress()` - Convert address to coordinates
- `getCurrentLocation()` - Get user's GPS location
- `calculateRoute()` - Distance & duration between points
- `findNearbyFuelStations()` - Find gas stations on route
- `findNearbyChargingStations()` - Find EV chargers
- `calculateDistance()` - Haversine distance formula

**Demo Mode** (Current):
- Returns mock data for demo
- Uses simulated locations
- Calculates distances using Haversine formula

**Production Mode** (Future):
- Connect to real Google Directions API
- Real traffic data integration
- Actual fuel station/charger locations
- Real-time updates

### 3. Database Models (Prisma)

**Core Entities**:

```typescript
User
├── Vehicles[]
├── Trips[]
├── FuelLogs[]
├── SavedPlaces[]
├── Subscriptions[]
└── UserSettings (1:1)

Vehicle
├── User
├── Trips[]
├── FuelLogs[]
└── Specifications

Trip
├── User
├── Vehicle
├── TripStops[]
├── Analytics

TripStop
└── Trip

Subscription
├── User
└── Payments[]
```

## 🔄 User Workflows

### Workflow 1: Basic Trip Planning

```
1. User opens app
   ↓
2. Click "Plan My Trip"
   ↓
3. Enter location (manual or GPS)
   ↓
4. Enter destination
   ↓
5. Select/enter vehicle
   ↓
6. Set fuel price
   ↓
7. System calculates:
   • Route (distance, duration, traffic)
   • Fuel required (with adjustments)
   • Cost breakdown
   • Safety analysis
   ↓
8. Display TripAnalysisCard
   ↓
9. User can:
   • Save trip
   • Add stops
   • Adjust parameters
   • Start navigation
```

### Workflow 2: Insufficient Fuel Alert

```
1. Trip analysis calculated
   ↓
2. System checks: currentFuel >= requiredFuel + safetyBuffer
   ↓
3. If insufficient:
   ├─ warningLevel = 'critical'
   ├─ Show alert banner
   ├─ Calculate refuel point
   └─ Suggest fuel stations
   ↓
4. User can:
   ├─ Add fuel stop
   ├─ Refuel at suggested station
   └─ Cancel trip
```

### Workflow 3: Multi-Stop Trip

```
1. Create base trip
   ↓
2. Add stops (fuel, restaurant, rest, custom)
   ↓
3. For each stop:
   ├─ Calculate distance from previous
   ├─ Update fuel calculation
   └─ Estimate arrival time
   ↓
4. Recalculate total:
   ├─ Total distance
   ├─ Total time
   ├─ Total fuel required
   └─ Cost breakdown
```

## 🎨 Component Architecture

### Component Hierarchy

```
App (page.tsx)
├── Navigation
├── Hero Section
├── Features Grid
├── TripPlanner (Modal)
│   ├── LocationInput
│   ├── VehicleSelector
│   │   ├── SearchMode
│   │   └── ManualMode
│   └── TimeSelector
├── TripAnalysisCard
│   ├── RouteDisplay
│   ├── WarningBanner
│   ├── MetricGrid
│   │   └── MetricCard (x8)
│   ├── FuelAnalysis
│   └── ActionButton
└── Footer
```

### MetricCard Component

```typescript
Interface:
  label: string              // "Fuel Required"
  value: number             // 24.4
  unit: string              // "L"
  icon: ReactNode           // <Fuel />
  trend?: 'up'|'down'|'neutral'  // "up"
  trendValue?: string       // "27 minutes late"
  warning?: boolean         // shows alert styling
  success?: boolean         // shows success styling
  onClick?: () => void      // interaction
```

**Styling Variants**:
- Normal: `bg-white dark:bg-slate-800`
- Success: `bg-fuel-50 dark:bg-fuel-900/20`
- Warning: `bg-alert-50 dark:bg-alert-900/20`

### TripAnalysisCard Component

Composite component showing:
- Route summary (from → to)
- Warning banner (if needed)
- Core metrics: distance, time, fuel, cost
- Efficiency metrics: cost/km, range, safety margin
- Action button (optional)

## 🔐 Data Flow

### Trip Calculation Flow

```
TripPlanner.tsx
    ↓
User Input:
├─ startLocation: "Islamabad"
├─ destination: "Lahore"
├─ vehicle: "Toyota Corolla"
├─ currentFuel: 30 L
└─ fuelPrice: 270 PKR/L
    ↓
geocodeAddress()
├─ Converts "Islamabad" → {lat: 33.7294, lng: 73.1883}
└─ Converts "Lahore" → {lat: 31.5204, lng: 74.3587}
    ↓
calculateRoute()
├─ Distance: ~374 km
├─ Duration: ~4h 32m
└─ TrafficDuration: ~5h 22m
    ↓
calculateFuelRequired()
├─ BaseFuel: 374 / 14 = 26.7 L
├─ TrafficAdjustment: +8% = 28.8 L
├─ SafetyBuffer: +15% = 33.1 L
└─ Results:
    ├─ fuelRequired: 28.8 L
    ├─ fuelCost: 7,776 PKR
    ├─ fuelRemaining: 1.2 L
    ├─ warningLevel: 'warning'
    └─ safetyMargin: 4.3 L
    ↓
TripAnalysisCard
    ↓
Display Results
```

## 📊 Database Queries

### Get User's Recent Trips

```sql
SELECT t.* FROM "Trip" t
WHERE t."userId" = 'user123'
ORDER BY t."createdAt" DESC
LIMIT 10;
```

### Calculate Monthly Stats

```sql
SELECT
  COUNT(*) as "tripCount",
  SUM("distance") as "totalDistance",
  AVG("estimatedMileage") as "avgMileage",
  SUM("fuelCost") as "totalCost"
FROM "Trip"
WHERE "userId" = 'user123'
  AND "createdAt" >= CURRENT_DATE - INTERVAL 1 month
GROUP BY DATE(TRUNC("createdAt", 'month'));
```

### Find Fuel Purchase Trends

```sql
SELECT
  v."name" as "vehicle",
  TRUNC("date", 'month') as "month",
  COUNT(*) as "purchases",
  SUM("liters") as "totalLiters",
  SUM("cost") as "totalCost",
  AVG("pricePer") as "avgPrice"
FROM "FuelLog" fl
JOIN "Vehicle" v ON fl."vehicleId" = v."id"
WHERE fl."userId" = 'user123'
GROUP BY v."id", TRUNC("date", 'month')
ORDER BY "month" DESC;
```

## 🚀 API Routes (To Implement)

### Trips API

```typescript
GET /api/trips
  Response: {
    trips: Trip[],
    pagination: { total, page, pageSize }
  }

POST /api/trips
  Body: { startLocation, destination, vehicleId, ... }
  Response: { trip: Trip }

GET /api/trips/[id]
  Response: { trip: Trip, analysis: TripAnalysis }

PUT /api/trips/[id]
  Body: { status, notes, actualFuel, ... }
  Response: { trip: Trip }

DELETE /api/trips/[id]
  Response: { success: boolean }
```

### Vehicles API

```typescript
GET /api/vehicles
  Response: { vehicles: Vehicle[] }

POST /api/vehicles
  Body: { name, manufacturer, model, year, fuelType, ... }
  Response: { vehicle: Vehicle }

PUT /api/vehicles/[id]
  Body: { name, averageMileage, currentFuel, ... }
  Response: { vehicle: Vehicle }

DELETE /api/vehicles/[id]
  Response: { success: boolean }
```

### Analytics API

```typescript
GET /api/analytics/summary
  Response: {
    totalTrips: number,
    totalDistance: number,
    totalFuelCost: number,
    avgMileage: number,
    monthlyStats: { month, trips, distance, cost }[]
  }

GET /api/analytics/vehicles
  Response: { vehicles: VehicleStats[] }

GET /api/analytics/expenses
  Response: { monthly, yearly, byVehicle }
```

### Admin API

```typescript
GET /api/admin/stats
  Response: {
    totalUsers: number,
    activeUsers: number,
    subscriptionRevenue: number,
    topRoutes: Route[]
  }

GET /api/admin/users
  Response: { users: User[], pagination }

POST /api/admin/settings
  Body: { fuelPriceMultiplier, safetyBuffer, ... }
  Response: { success: boolean }
```

## 🔌 External Integrations

### Google Maps Platform

**APIs Used**:
1. **Geocoding API** - Address → Coordinates
2. **Directions API** - Route calculation
3. **Distance Matrix API** - Multiple route comparison
4. **Places API** - Nearby fuel/charging stations

**Configuration**:
```javascript
const mapsClient = new Client({
  key: process.env.GOOGLE_MAPS_API_KEY,
  language: 'en',
});
```

### Stripe Integration

**Products**:
- Pro Subscription: $4.99/month
- Business Subscription: $14.99/month

**Webhooks**:
- `customer.subscription.created`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `charge.refunded`

### NextAuth Configuration

**Providers**:
- Email/Password (database)
- Google OAuth (optional)
- GitHub OAuth (optional)

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Verify against database
      },
    }),
  ],
};
```

## 📈 Performance Optimizations

### Frontend
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- CSS-in-JS Tailwind (no extra CSS)
- Lazy loading for components
- Memoization with `React.memo()`

### Backend
- Database query optimization with indexes
- Connection pooling with Prisma
- Caching layer (Redis optional)
- API response compression
- Rate limiting per user

### Database
```sql
-- Indexes for common queries
CREATE INDEX idx_trip_user ON "Trip"("userId" DESC);
CREATE INDEX idx_trip_date ON "Trip"("createdAt" DESC);
CREATE INDEX idx_fuellog_vehicle ON "FuelLog"("vehicleId");
CREATE INDEX idx_fuellog_date ON "FuelLog"("date" DESC);
```

## 🔒 Security Patterns

### Input Validation

```typescript
// Use Zod schemas
const tripPlanSchema = z.object({
  startLocation: z.string().min(2).max(100),
  destination: z.string().min(2).max(100),
  vehicleId: z.string().uuid(),
  distance: z.number().positive(),
  currentFuel: z.number().nonnegative(),
});
```

### Authentication

```typescript
// Middleware to check auth
export function withAuth(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });
    return handler(req, res, session);
  };
}
```

### Rate Limiting

```typescript
// Simple rate limiter
import Ratelimit from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

## 📚 Design Patterns Used

### Service Pattern
Services encapsulate business logic:
- `fuelCalculations.ts` - Pure functions
- `googleMapsService.ts` - External API integration

### Factory Pattern
Create common UI components:
- `MetricCard` - Reusable metric display
- `MetricGrid` - Layout wrapper

### Observer Pattern
React hooks handle state:
- `useState()` - Reactive state
- `useEffect()` - Side effects
- `zustand` - Global state (if added)

### Adapter Pattern
Handle multiple vehicle types:
- Gasoline cars
- Diesel vehicles
- EVs
- Hybrid vehicles

## 🎯 Testing Strategy

### Unit Tests
```typescript
describe('fuelCalculations', () => {
  it('calculates basic fuel requirement', () => {
    const fuel = calculateBaseFuelRequirement(342, 14);
    expect(fuel).toBeCloseTo(24.43, 2);
  });
  
  it('applies traffic adjustment', () => {
    const adjusted = adjustFuelConsumption(25, {
      trafficLevel: 'heavy',
    });
    expect(adjusted.adjustedFuel).toBeGreaterThan(25);
  });
});
```

### Integration Tests
```typescript
describe('Trip Planning', () => {
  it('plans complete trip', async () => {
    const analysis = await planTrip({
      startLocation: 'Islamabad',
      destination: 'Lahore',
      // ...
    });
    
    expect(analysis.distance).toBeGreaterThan(0);
    expect(analysis.fuelRequired).toBeGreaterThan(0);
  });
});
```

## 📈 Scalability Roadmap

**Phase 1 (Current)**
- Single database
- Mock external APIs
- Basic authentication

**Phase 2**
- Redis caching
- API rate limiting
- Email notifications

**Phase 3**
- Database sharding
- CDN for static assets
- Microservices (search, analytics)

**Phase 4**
- Global deployment (multi-region)
- Real-time updates (WebSocket)
- Fleet management scale

---

**Keep this document updated as architecture evolves!**
